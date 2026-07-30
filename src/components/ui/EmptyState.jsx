import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";

export default function EmptyState({
  icon = <PackageOpen size={52} />,
  title,
  description,
  buttonText,
  buttonLink,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-beige-200 flex items-center justify-center text-forest-600 mb-6">
        {icon}
      </div>

      <h2 className="font-display text-2xl text-[#1a1a1a] mb-3">
        {title}
      </h2>

      <p className="text-[#7a7a7a] max-w-md leading-relaxed mb-8">
        {description}
      </p>

      {buttonText && buttonLink && (
        <Link to={buttonLink} className="btn-primary">
          {buttonText}
        </Link>
      )}
    </div>
  );
}