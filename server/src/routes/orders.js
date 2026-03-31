import { supabase } from "../db.js";

export async function orderRoutes(fastify) {
  // GET /api/orders — user's order history (requires auth)
  fastify.get("/api/orders", async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return reply.code(401).send({ error: "Not authenticated" });
    }

    const { data: userData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !userData?.user) {
      return reply.code(401).send({ error: "Invalid token" });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        email,
        status,
        total,
        customer_name,
        shipping_address,
        created_at,
        order_items (
          id,
          quantity,
          price_at_purchase,
          product_id,
          products:product_id (
            driver,
            year,
            set_name,
            condition,
            image_url
          )
        )
      `)
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return reply.code(500).send({ error: "Failed to fetch orders" });
    }

    return orders;
  });
}
