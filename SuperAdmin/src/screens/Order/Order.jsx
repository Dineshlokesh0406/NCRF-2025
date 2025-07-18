import { useEffect, useState } from "react";
import "./Order.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/admin_assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Network error while fetching orders");
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: e.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      toast.error("Network error while updating order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const formatItems = (items) =>
    items.map((item, index) => (
      <p key={index}>{`${item.name} x ${item.quantity}`}</p>
    ));

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div className="order-address-details">
              <div className="order-item-food">
                {formatItems(order.items)}
              </div>
              <p className="order-item-name">
                {order.address
                  ? `${order.address.firstName} ${order.address.lastName}`
                  : "Unknown"}
              </p>
              <div className="order-item-address">
                <p>{order.address ? `${order.address.street}, ` : ""}</p>
                <p>
                  {order.address
                    ? `${order.address.email}, ${order.address.country}, ${order.address.zipCode}`
                    : ""}
                </p>
              </div>
              <p className="order-item-phone">
                {order.address ? order.address.phone : "N/A"}
              </p>
            </div>
            <div className="order-food-details">
              <p>Items: {order.items.length}</p>
              <p>Amount: ₹{order.amount}</p>

              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered - Thank you for ordering!">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
