import React from "react";

const SummaryPage = ({
  totalItems,
  totalPrice,
  discountPercent,
  discountAmount,
  selectedCoupon,
  finalTotal,
  coupons = [], // ✅ Default value ensures no crash
  selectedCouponHandler,
  clearCouponHandler,
  openCouponModal,
}) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between relative">
      <div>
        <h2 className="text-xl font-semibold mb-4">Summary</h2>

        <div className="space-y-3 mb-6">
          <p className="text-gray-700 text-lg flex justify-between">
            <span>Total Items:</span>
            <span className="font-bold text-gray-900">{totalItems}</span>
          </p>

          <p className="text-gray-700 text-lg flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold text-gray-900">₹{totalPrice}</span>
          </p>

          {/* ✅ Coupon Apply / Clear Button (visible only if coupons exist) */}
          {coupons.length > 0 && (
            <div className="flex justify-end sm:hidden mt-4">
              {selectedCoupon ? (
                <button
                  onClick={clearCouponHandler}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Clear Coupon ({selectedCoupon.code})
                </button>
              ) : (
                <button
                  onClick={openCouponModal}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
                >
                  Apply Coupon
                </button>
              )}
            </div>
          )}

          {/* ✅ Discount display */}
          {discountPercent > 0 && (
            <p className="text-green-600 text-lg flex justify-between border-t pt-3 mt-3">
              <span>
                Discount ({discountPercent}% - {selectedCoupon?.code})
              </span>
              <span>- ₹{discountAmount.toFixed(2)}</span>
            </p>
          )}

          <p className="text-gray-900 font-bold text-lg flex justify-between border-t pt-4 mt-4">
            <span>Grand Total:</span>
            <span className="text-amber-600 text-xl font-bold">
              ₹{finalTotal.toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      <button className="bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition duration-300">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default SummaryPage;
