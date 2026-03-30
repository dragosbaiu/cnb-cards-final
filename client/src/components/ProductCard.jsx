import { useContext, useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "../hooks/useTranslation";
import { CartContext } from "../context/CartContext";

const conditionColors = {
  Mint: "bg-green-100 text-green-800",
  "Near Mint": "bg-blue-100 text-blue-800",
  Excellent: "bg-yellow-100 text-yellow-800",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function StockBadge({ stock }) {
  if (stock <= 0) return <p className="text-xs text-red-500 font-medium">Out of stock</p>;
  if (stock < 10) return <p className="text-xs text-orange-500 font-medium">Only {stock} left</p>;
  return <p className="text-xs text-green-600 font-medium">In stock</p>;
}

export function ProductCard({ card }) {
  const { t } = useTranslation();
  const { addItem, updateQuantity, removeItem, items } = useContext(CartContext);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = items.find((i) => i.id === card.id);
  const inCart = !!cartItem;
  const isSealed = card.product_type === "sealed_box";

  const conditionKey = card.condition.toLowerCase().replace(" ", "_");

  const handleAdd = () => {
    addItem(card);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.div
      className="bg-gray-900 rounded-lg border border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
      variants={cardVariants}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={card.image}
          alt={`${card.driver} trading card`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="text-sm font-semibold text-white">{card.driver}</h3>
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap ${
              conditionColors[card.condition] || "bg-gray-100 text-gray-800"
            }`}
          >
            {t(`condition_${conditionKey}`)}
          </span>
        </div>
        <p className="text-xs text-[#9CA3AF] mt-1">
          {card.year} {card.set}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-bold text-white">&euro;{card.price.toFixed(2)}</p>
          <StockBadge stock={card.stock} />
        </div>

        <div className="mt-auto pt-3">
          {isSealed && inCart ? (
            // Sealed box quantity controls
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (cartItem.quantity === 1) removeItem(card.id);
                    else updateQuantity(card.id, cartItem.quantity - 1);
                  }}
                  className="w-7 h-7 rounded-md bg-gray-700 text-white text-sm font-bold flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  −
                </button>
                <span className="text-white text-sm font-semibold w-4 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(card.id, cartItem.quantity + 1)}
                  disabled={cartItem.quantity >= card.stock}
                  className="w-7 h-7 rounded-md bg-gray-700 text-white text-sm font-bold flex items-center justify-center hover:bg-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(card.id)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                {t("cart_remove")}
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={inCart || card.stock === 0}
              className={`w-full px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition-all ${
                inCart
                  ? "bg-green-600 cursor-default"
                  : card.stock === 0
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-f1-red hover:bg-red-700"
              }`}
            >
              {justAdded || inCart ? t("added_to_cart") : t("featured_add_to_cart")}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
