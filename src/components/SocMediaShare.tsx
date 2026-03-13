import Link from "next/link";

import { RiTwitterXLine } from "react-icons/ri";
import { FaFacebookSquare } from "react-icons/fa";

interface PageProps {
  shareUrl: string;
  shareText: string;
}

const SocMediaShare = ({ shareText, shareUrl }: PageProps) => {
  return (
    <div className="flex items-center justify-end gap-4 mt-10 flex-wrap mb-2">
      <Link
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-80 transition"
      >
        <FaFacebookSquare />
      </Link>
      <Link
        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
        target="_blank"
        className="bg-black text-white px-4 py-2 rounded hover:opacity-80 transition"
      >
        <RiTwitterXLine />
      </Link>
    </div>
  );
};

export default SocMediaShare;
