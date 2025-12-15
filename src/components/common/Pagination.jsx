import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({ canPrev, canNext, onPrev, onNext, currentPage, totalPages }) => {
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <Button
        onClick={onPrev}
        disabled={!canPrev}
        variant="secondary"
        className={canPrev
          ? "dark:text-black hover:bg-zinc-800 hover:text-white dark:hover:bg-white/70 dark:hover:text-black"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      <span className="text-sm text-gray-700 dark:text-slate-200">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        onClick={onNext}
        disabled={!canNext}
        variant="secondary"
        className={canNext
          ? "dark:text-black hover:bg-zinc-800 hover:text-white dark:hover:bg-white/70 dark:hover:text-black"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  )
}

export default Pagination
