import {useState, useRef, useEffect} from "react";
import PencilIcon from "../../assets/profile_icons/pencil.png"

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
                className={`relative overflow-hidden lg:w-65 lg:h-65 md:w-50 md:h-50 h-50 w-50 rounded-full
                        flex border-3 bg-stone-100 border-stone-200 dark:bg-zinc-900 dark:border-zinc-800 hover:bg-stone-200 dark:hover:bg-zync-500 justify-center items-center group cursor-pointer shadow-2xl`}
            >
                {profileImagePreview && (
                    <img
                        src={profileImagePreview}
                        alt="Profile Image"
                        className="w-full h-full object-cover rounded-full"
                    />
                )}

                <div
                    className={`flex justify-center items-center absolute inset-0 bg-black/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out`}>
                    <img
                        src={PencilIcon}
                        alt="Edit profile"
                        className={`h-1/6 w-1/6`}
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