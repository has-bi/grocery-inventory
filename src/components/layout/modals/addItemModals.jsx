import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddItemModal({ isopen, onClose }) {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    unit: "",
    quantity: "",
    expireDate: "",
  });
}

const handleSubmit = (e) => {
  e.preventDefault();
  console.log(formData);
  onClose();
};
