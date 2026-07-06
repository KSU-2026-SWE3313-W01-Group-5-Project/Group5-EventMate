/**
 * ProfileImageUpload Component
 *
 * Returns the component responsible for allowing a user to upload a new profile picture and view their current profile picture
 *
 * @param {string} props.profileImagePreview - simply the current picture a user has uploaded but has not saved yet to the database
 *
 * @param {Function} props.setProfileImagePreview - the setter passed in from the parent file
 *
 * @param {Function} props.setProfileImageFile - setter from the parent file that is responsible for saving the profileimagefile (not just the preview)
 *
 * The difference between the profileimagefile and profileimagepreview is that the preview is a reference to the image, basically a link that we can pass to
 * an <img>'s 'src={}' field to tell it what picture to display, and the file is the literal file we send to the backend so our server can download it and save it
 * to the user's database
*/

import {useRef} from "react";
import PencilIcon from "../../assets/profile_icons/pencil.png"

export default function ProfileImageUpload({
    profileImagePreview,
    setProfileImagePreview,
    setProfileImageFile
    }) {

    // Used for detecting when the user clicks on the profile picture element so we can open the file upload box (see return below)
    const fileInputRef = useRef(null);

    // Handles image setters
    function handleImageChange(e) {
        const file = e.target.files[0];

        // verifies there is a file uploaded
        if (!file) return;

        setProfileImageFile(file);

        // creates that reference url from the file so the <img> elements can display the preview before the user saves it
        const imageUrl = URL.createObjectURL(file);
        setProfileImagePreview(imageUrl);
    }

    return (
        <section className={`flex items-center lg:pl-15 lg:pb-17 md:pl-12 md:pb-15 md:pr-3`}>

            {/* Responsible for detecting when the user clicks on their profile picture, this allows us to know when to prompt them to upload a picture */}
            <div
                onClick={() => fileInputRef.current.click()}
                className={`relative overflow-hidden lg:w-65 lg:h-65 md:w-50 md:h-50 h-50 w-50 rounded-full
                        flex border-3 bg-stone-100 border-stone-200 dark:bg-zinc-900 dark:border-zinc-800 hover:bg-stone-200 dark:hover:bg-zync-500 justify-center items-center group cursor-pointer shadow-2xl`}
            >
                {/* Only displays the user's profile picture when they actually have one (which they always will because the database defaults to the base avatar for everyone */}
                {profileImagePreview && (
                    <img
                        src={profileImagePreview}
                        alt="Profile Image"
                        className="w-full h-full object-cover rounded-full"
                    />
                )}

                {/* The pencil icon aesthetic that appears when a user hover's over the profile picture element */}
                <div
                    className={`flex justify-center items-center absolute inset-0 bg-black/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out`}>
                    <img
                        src={PencilIcon}
                        alt="Edit profile"
                        className={`h-1/6 w-1/6`}
                    />
                </div>

                {/* Fires when the fileInputRef is called from the click listener on the div wrapper for this whole file */}
                {/* Type file allows this page to automatically open the user's file explorer and accept a file */}
                {/* In a real production website we would have more checks and systems to verify what type of file the user uploads, here we just accept anything */}
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