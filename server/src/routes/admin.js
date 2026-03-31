import { supabase } from "../db.js";
import multipart from "@fastify/multipart";

function verifyAdmin(request, reply) {
  const key = request.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_SECRET) {
    reply.code(401).send({ error: "Unauthorized" });
    return false;
  }
  return true;
}

export async function adminRoutes(fastify) {
  await fastify.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

  // Middleware — check admin key on all /api/admin routes
  fastify.addHook("onRequest", async (request, reply) => {
    if (!verifyAdmin(request, reply)) return;
  });

  // POST /api/admin/upload-image — upload card image to Supabase Storage
  fastify.post("/api/admin/upload-image", async (request, reply) => {
    const data = await request.file();
    if (!data) return reply.code(400).send({ error: "No file provided" });

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(data.mimetype)) {
      return reply.code(400).send({ error: "Only JPEG, PNG and WebP images are allowed" });
    }

    const buffer = await data.toBuffer();
    const ext = data.mimetype === "image/png" ? "png" : data.mimetype === "image/webp" ? "webp" : "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filename, buffer, { contentType: data.mimetype, upsert: false });

    if (error) return reply.code(500).send({ error: "Failed to upload image" });

    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filename);
    return { url: urlData.publicUrl };
  });

  // GET /api/admin/products — list ALL products (including out of stock)
  fastify.get("/api/admin/products", async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return fastify.httpErrors.internalServerError("Failed to fetch products");
    return data;
  });

  // POST /api/admin/products — create product
  fastify.post("/api/admin/products", async (request, reply) => {
    const { driver, year, set_name, condition, price, image_url, sport, product_type, stock, featured } = request.body;

    const { data, error } = await supabase
      .from("products")
      .insert({
        driver,
        year: Number(year),
        set_name,
        condition,
        price: Number(price),
        image_url: image_url || null,
        sport: sport || "f1",
        product_type: product_type || "single",
        stock: stock != null ? Number(stock) : 1,
        featured: featured || false,
      })
      .select()
      .single();

    if (error) return fastify.httpErrors.badRequest("Failed to create product");
    reply.code(201);
    return data;
  });

  // PUT /api/admin/products/:id — update product
  fastify.put("/api/admin/products/:id", async (request) => {
    const { id } = request.params;
    const updates = {};
    const allowed = ["driver", "year", "set_name", "condition", "price", "image_url", "sport", "product_type", "stock", "featured"];

    for (const key of allowed) {
      if (request.body[key] !== undefined) {
        if (key === "year" || key === "stock") updates[key] = Number(request.body[key]);
        else if (key === "price") updates[key] = Number(request.body[key]);
        else updates[key] = request.body[key];
      }
    }

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return fastify.httpErrors.badRequest("Failed to update product");
    return data;
  });

  // GET /api/admin/orders/export — download all orders as CSV (Excel-compatible)
  // Auth via query param ?key= (needed for browser download links)
  fastify.get("/api/admin/orders/export", async (request, reply) => {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        customer_name,
        email,
        status,
        total,
        shipping_address,
        order_items (
          quantity,
          price_at_purchase,
          products:product_id ( driver, year, set_name, condition )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) return reply.code(500).send({ error: "Failed to fetch orders" });

    const headers = [
      "Order ID", "Date", "Customer Name", "Email",
      "Address", "City", "Postal Code", "Country",
      "Product", "Year", "Set", "Condition",
      "Quantity", "Unit Price (€)", "Line Total (€)", "Order Total (€)", "Status",
    ];

    const escape = (v) => {
      const s = String(v ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const rows = [];
    for (const order of orders) {
      const addr = order.shipping_address || {};
      for (const item of order.order_items || []) {
        const p = item.products || {};
        rows.push([
          order.id,
          new Date(order.created_at).toLocaleDateString("en-GB"),
          order.customer_name || "",
          order.email,
          addr.line1 || "",
          addr.city || "",
          addr.postal_code || "",
          addr.country || "",
          p.driver || "",
          p.year || "",
          p.set_name || "",
          p.condition || "",
          item.quantity,
          Number(item.price_at_purchase).toFixed(2),
          (item.quantity * Number(item.price_at_purchase)).toFixed(2),
          Number(order.total).toFixed(2),
          order.status,
        ]);
      }
    }

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map(escape).join(",")),
    ].join("\n");

    const filename = `cnb-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    reply.header("Content-Type", "text/csv; charset=utf-8");
    reply.header("Content-Disposition", `attachment; filename="${filename}"`);
    return reply.send("\uFEFF" + csv); // BOM prefix = Excel opens UTF-8 correctly
  });

  // DELETE /api/admin/products/:id — delete product
  fastify.delete("/api/admin/products/:id", async (request, reply) => {
    const { id } = request.params;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) return fastify.httpErrors.badRequest("Failed to delete product");
    reply.code(204).send();
  });
}
