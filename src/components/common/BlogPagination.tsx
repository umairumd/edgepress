import Link from "next/link";
import { IconArrowLeft, IconArrowRight } from "@/components/icons";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function blogPageHref(page: number): string {
  if (page <= 1) return "/blog";
  return `/blog?page=${page}`;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const page = sorted[i];
    const prev = sorted[i - 1];
    if (i > 0 && prev !== undefined && page - prev > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  }
  return result;
}

const BlogPagination = ({ currentPage, totalPages }: BlogPaginationProps) => {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="td-blog-pagenation mt-40" aria-label="Blog pagination">
      <ul>
        <li className={hasPrevious ? undefined : "disabled"}>
          {hasPrevious ? (
            <Link
              className="td-blog-pagenation-nav"
              href={blogPageHref(currentPage - 1)}
              aria-label="Previous page"
            >
              <IconArrowLeft aria-hidden="true" />
              <span>Previous</span>
            </Link>
          ) : (
            <span className="td-blog-pagenation-nav" aria-disabled="true">
              <IconArrowLeft aria-hidden="true" />
              <span>Previous</span>
            </span>
          )}
        </li>

        {pageNumbers.map((item, idx) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${idx}`} className="ellipsis">
              <span aria-hidden="true">…</span>
            </li>
          ) : (
            <li key={item} className={item === currentPage ? "selected" : undefined}>
              {item === currentPage ? (
                <span className="active" aria-current="page">
                  {item}
                </span>
              ) : (
                <Link href={blogPageHref(item)} aria-label={`Page ${item}`}>
                  {item}
                </Link>
              )}
            </li>
          )
        )}

        <li className={hasNext ? undefined : "disabled"}>
          {hasNext ? (
            <Link
              className="td-blog-pagenation-nav"
              href={blogPageHref(currentPage + 1)}
              aria-label="Next page"
            >
              <span>Next</span>
              <IconArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <span className="td-blog-pagenation-nav" aria-disabled="true">
              <span>Next</span>
              <IconArrowRight aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default BlogPagination;
