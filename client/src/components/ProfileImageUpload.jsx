import {useState, useRef} from "react";
import PencilIcon from "../assets/Profile_icon/pencil.png"

export default function ProfileImageUpload({
    profileImagePreview,
    setProfileImagePreview,
    setProfileImageFile
    }) {

    const fileInputRef = useRef(null);

    function handleImageChange(e) {
        const file = e.target.files[0];

        if (!file) return;

        setProfileImageFile(file);

        const imageUrl = URL.createObjectURL(file);
        setProfileImagePreview(imageUrl);
    }

    return (
        <section className={`flex items-center lg:pl-15 lg:pb-17 md:pl-12 md:pb-15 md:pr-3`}>
            <div
                onClick={() => fileInputRef.current.click()}
                className="relative overflow-hidden lg:w-65 lg:h-65 md:w-50 md:h-50 h-50 w-50  bg-stone-700 rounded-full
                        flex border-4 border-black hover:bg-stone-500 justify-center items-center group cursor-pointer"
            >
                {profileImagePreview && (
                    <img
                        src={profileImagePreview}
                        alt="Profile Image"
                        className="w-full h-full object-cover rounded-full"
                    />
                )}

                <div
                    className={`flex justify-center items-center absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out`}>
                    <img
                        src={PencilIcon}
                        alt="Edit profile"
                        className={`h-1/5 w-1/5`}
                    />
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

            </div>

        </section>
    );
}