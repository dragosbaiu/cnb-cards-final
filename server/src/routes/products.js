import { supabase } from "../db.js";

export async function productRoutes(fastify) {
  // GET /api/products — list with optional filters
  fastify.get("/api/products", async (request) => {
    const { sport, product_type, condition, year, set_name, featured } = request.query;

    let query = supabase
      .from("products")
      .select("*")
      .gt("stock", 0)
      .order("created_at", { ascending: false });

    if (sport) query = query.eq("sport", sport);
    if (product_type) query = query.eq("product_type", product_type);
    if (condition) query = query.eq("condition", condition);
    if (year) query = query.eq("year", Number(year));
    if (set_name) query = query.eq("set_name", set_name);
    if (featured === "true") query = query.eq("featured", true);

    const { data, error } = await query;

    if (error) {
      return fastify.httpErrors.internalServerError("Failed to fetch products");
    }

    return data;
  });

  // GET /api/products/:id — single product
  fastify.get("/api/products/:id", async (request) => {
    const { id } = request.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return fastify.httpErrors.notFound("Product not found");
    }

    return data;
  });
}
