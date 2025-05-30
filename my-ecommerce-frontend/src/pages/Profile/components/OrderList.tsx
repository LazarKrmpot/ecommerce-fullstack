// import React from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

// interface OrderListProps {
//   orders: Order[];
// }

// const statusIcons = {
//   pending: Clock,
//   processing: Package,
//   shipped: Truck,
//   delivered: CheckCircle,
//   cancelled: XCircle,
// };

// const statusColors = {
//   pending: "text-yellow-500",
//   processing: "text-blue-500",
//   shipped: "text-purple-500",
//   delivered: "text-green-500",
//   cancelled: "text-red-500",
// };

// const OrderList: React.FC<OrderListProps> = ({ orders }) => {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold text-slate-900">Order History</h2>

//       <div className="space-y-4">
//         {orders.map((order) => {
//           const StatusIcon = statusIcons[order.status];
//           const statusColor = statusColors[order.status];

//           return (
//             <Card key={order._id}>
//               <CardHeader className="pb-3">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm text-slate-500">
//                       Order #{order._id.slice(-8)}
//                     </p>
//                     <p className="text-sm text-slate-500">
//                       {formatDate(order.createdAt)}
//                     </p>
//                   </div>
//                   <div className={`flex items-center ${statusColor}`}>
//                     <StatusIcon className="h-5 w-5 mr-1" />
//                     <span className="text-sm font-medium capitalize">
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="divide-y">
//                     {order.items.map((item, index) => (
//                       <div
//                         key={index}
//                         className="py-3 flex justify-between items-center"
//                       >
//                         <div className="flex items-center space-x-4">
//                           {item.image && (
//                             <img
//                               src={item.image}
//                               alt={item.name}
//                               className="h-16 w-16 object-cover rounded"
//                             />
//                           )}
//                           <div>
//                             <p className="font-medium">{item.name}</p>
//                             <p className="text-sm text-slate-500">
//                               Quantity: {item.quantity}
//                             </p>
//                           </div>
//                         </div>
//                         <p className="font-medium">${item.price.toFixed(2)}</p>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="border-t pt-4">
//                     <div className="flex justify-between items-center">
//                       <p className="font-medium">Total</p>
//                       <p className="text-lg font-bold">
//                         ${order.total.toFixed(2)}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="bg-slate-50 p-4 rounded-lg">
//                     <p className="text-sm font-medium text-slate-700 mb-2">
//                       Shipping Address
//                     </p>
//                     <p className="text-sm text-slate-600">
//                       {order.shippingAddress.address}
//                     </p>
//                     <p className="text-sm text-slate-600">
//                       {order.shippingAddress.city},{" "}
//                       {order.shippingAddress.state}{" "}
//                       {order.shippingAddress.postalCode}
//                     </p>
//                     <p className="text-sm text-slate-600">
//                       {order.shippingAddress.country}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}

//         {orders.length === 0 && (
//           <Card>
//             <CardContent className="py-8">
//               <div className="text-center">
//                 <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//                 <p className="text-slate-600">No orders yet</p>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderList;
