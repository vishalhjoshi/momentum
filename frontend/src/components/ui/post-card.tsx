"use client";

import {
  FaRegPaperPlane,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { useState } from "react";

interface PostCardProps {
  author?: string;
  authorHandle?: string;
  authorAvatar?: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  timeAgo?: string;
  onLike?: (liked: boolean) => void;
  onBookmark?: (bookmarked: boolean) => void;
  onShare?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  author = "HextaStudio",
  authorHandle = "@HextaStudio",
  authorAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  content = `HextaUI – Gorgeous web components without any effort! ✨

🚀 HextaStudio launched their new product HextaUI, a collection of beautiful web components.

🥳 Check it out now!`,
  imageUrl = "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1920&h=1080&fit=crop",
  imageAlt = "HextaUI",
  timeAgo = "7h",
  onLike,
  onBookmark,
  onShare,
}) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    onLike?.(newLiked);
  };

  const handleBookmark = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    onBookmark?.(newBookmarked);
  };

  const handleShare = () => {
    onShare?.();
  };

  return (
    <div className="m-4 max-w-[30rem] w-full rounded-4xl bg-background border border-primary/10 shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 card-header">
        <div className="flex items-center gap-4">
          <img
            src={authorAvatar}
            alt={author}
            width={35}
            height={35}
            className="rounded-full object-cover"
          />
          <div>
            <h3 className="flex flex-col">
              {author}
              <span className="flex items-center gap-2 opacity-70 text-sm">
                <small>{authorHandle}</small>
                <span>·</span>
                <small>{timeAgo}</small>
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 flex flex-col gap-6">
        <p className="whitespace-pre-wrap text-foreground">
          {content}
        </p>
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-w-full rounded-lg object-cover w-full"
        />
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-evenly gap-2">
        <button
          onClick={handleLike}
          className="flex grow items-center justify-center gap-3 rounded-xl px-4 py-2 transition hover:bg-secondary"
          aria-label={liked ? "Unlike" : "Like"}
        >
          {liked ? (
            <FaHeart className="text-red-500" size={18} />
          ) : (
            <FaRegHeart size={18} />
          )}
          <span className="inline font-medium opacity-90 text-[14px] transition hover:opacity-100 max-sm:hidden">
            {liked ? "Liked" : "Like"}
          </span>
        </button>

        <button
          onClick={handleBookmark}
          className="flex grow items-center justify-center gap-3 rounded-xl px-4 py-2 transition hover:bg-secondary"
          aria-label={bookmarked ? "Unsave" : "Save"}
        >
          {bookmarked ? (
            <FaBookmark className="text-[#00bfff]" size={18} />
          ) : (
            <FaRegBookmark size={18} />
          )}
          <span className="inline font-medium opacity-90 text-[14px] transition hover:opacity-100 max-sm:hidden">
            {bookmarked ? "Saved" : "Save"}
          </span>
        </button>

        <button
          onClick={handleShare}
          className="flex grow items-center justify-center gap-3 rounded-xl px-4 py-2 transition hover:bg-secondary"
          aria-label="Share"
        >
          <FaRegPaperPlane size={18} />
          <span className="inline font-medium opacity-90 text-[14px] transition hover:opacity-100 max-sm:hidden">
            Share
          </span>
        </button>
      </div>
    </div>
  );
};

