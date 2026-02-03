"use client";
import Image from "next/image";
import type { CategoryCardProps } from "@/types/category";
import Link from "next/link";

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const getName = (c: typeof category) =>
    c.name?.en || Object.values(c.name || {})[0] || "";

  return (
    <div className="relative w-40 group bg-background-light dark:bg-background-dark-2 rounded-xl overflow-hidden">
      <Link href={`/category/${category.slug}`} className="w-40 ">
        <div className="relative">
          <Image
            src={category?.icon || "/images/placeholder-image.png"}
            alt={getName(category)}
            width={200}
            height={200}
            className="w-40 h-33.75 object-fill rounded-lg group-hover:scale-105 transition-transform"
            priority={true}
          />
          <h2 className="font-bold text-center line-clamp-2 mt-1 capitalize p-2 group-hover:text-secondary transition-colors dark:group-hover:text-secondary-dark text-sm">
            {getName(category)}
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
