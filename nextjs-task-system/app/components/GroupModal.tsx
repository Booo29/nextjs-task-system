"use client";

import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import { createGroup, updateGroup } from "../../services/groupService";
import ToastNotification from "./ToastNotification";


interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: any;
    setFormData: (formData: any) => void;
}

export function GroupModal({ isOpen, onClose, formData, setFormData }: UserModalProps) {

    const [showToast, setShowToast] = useState(false);
    const [toastProps, setToastProps] = useState({
        message: "",
        type: "success" as "success" | "error",
    });



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const updatedValue = name === "groupId" ? parseInt(value) : value;

        setFormData({ ...formData, [name]: updatedValue });
    };

    const handleSave = async () => {
        try {
            if (formData.id) {
                await updateGroup(formData.id, formData);
            } else {
                await createGroup(formData);
            }
            setToastProps({ message: "Group saved successfully", type: "success" });
            setShowToast(true);
            onClose();
            window.location.reload();
        } catch (error) {
            setToastProps({ message: "Error saving group", type: "error" });
            setShowToast(true);
            console.error("Error saving group: ", error);
        }
    };

    return (
        <div>
            <Modal show={isOpen} size="md" onClose={onClose} popup>
                <Modal.Header>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add or Edit Group</h2>
                </Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Enter name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="success" onClick={handleSave}>Save</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </Modal.Footer>
                {showToast && <ToastNotification message={toastProps.message} type={toastProps.type} />}
            </Modal>
        </div>
    );
}