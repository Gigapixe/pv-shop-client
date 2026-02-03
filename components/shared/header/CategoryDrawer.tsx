"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/zustand/store";
import { getAllCategories } from "@/services/categoryService";
import CloseButton from "@/components/ui/CloseButton";

import type { Category } from "@/types/category";

interface CategoryDrawerProps {
  initialTree?: Category[];
}

export default function CategoryDrawer({ initialTree }: CategoryDrawerProps) {
  const { isOpen, closeCategory } = useCategoryStore();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  const [tree, setTree] = useState<Category[] | null>(
    initialTree && initialTree.length > 0 ? initialTree : null,
  );
  const [nodes, setNodes] = useState<Category[]>(tree ?? []); // current visible nodes
  const [stack, setStack] = useState<Category[][]>([]); // navigation stack of previous node lists
  const [titleStack, setTitleStack] = useState<string[]>([]);
  const [currentTitle, setCurrentTitle] = useState<string>("All Categories");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // keep in sync if server provides updated tree later
  useEffect(() => {
    if (initialTree && initialTree.length > 0) {
      setTree(initialTree);
      setNodes(initialTree);
      setCurrentTitle("All Categories");
      setStack([]);
      setTitleStack([]);
    }
  }, [initialTree]);
  // animation state
  const [animating, setAnimating] = useState(false);
  const [animateOn, setAnimateOn] = useState(false); // toggles transforms
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [prevPanel, setPrevPanel] = useState<Category[] | null>(null);
  const [nextPanel, setNextPanel] = useState<Category[] | null>(null);
  const [prevPanelRef, setPrevPanelRef] = useState<HTMLDivElement | null>(null);
  const [nextPanelRef, setNextPanelRef] = useState<HTMLDivElement | null>(null);
  const ANIM_MS = 300; // match drawer transition

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllCategories({ cache: "no-store" });

      const data: Category[] = res?.data || [];
      setTree(data);
      setNodes(data);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // if server provided a tree, reuse it; otherwise fetch once
      if (tree === null) fetchCategories();
      else setNodes(tree);
    }
  }, [isOpen, tree, fetchCategories]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCategory();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCategory]);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // reset navigation when closed
      setStack([]);
      if (tree) setNodes(tree);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, tree]);

  const startForwardAnim = (newNodes: Category[], newTitle?: string) => {
    if (animating) return;
    setAnimating(true);
    setDirection("forward");
    setPrevPanel(nodes);
    setNextPanel(newNodes);

    // push current nodes and title to stack immediately for predictability
    setStack((s) => [...s, nodes]);
    setTitleStack((t) => [...t, currentTitle]);

    // reset scroll positions if refs exist
    if (nextPanelRef) nextPanelRef.scrollTop = 0;
    if (prevPanelRef) prevPanelRef.scrollTop = 0;

    // wait a tick then animate (double rAF for reliability)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimateOn(true)),
    );

    setTimeout(() => {
      setNodes(newNodes);
      setCurrentTitle(newTitle ?? (newNodes[0]?.name?.en || "Category"));
      setPrevPanel(null);
      setNextPanel(null);
      setAnimateOn(false);
      setAnimating(false);
    }, ANIM_MS + 10);
  };

  const startBackAnim = (prevNodes: Category[], prevTitle?: string) => {
    if (animating) return;
    setAnimating(true);
    setDirection("back");
    setPrevPanel(nodes);
    setNextPanel(prevNodes);

    // reset scroll positions if refs exist
    if (nextPanelRef) nextPanelRef.scrollTop = 0;
    if (prevPanelRef) prevPanelRef.scrollTop = 0;

    // wait a tick then animate (double rAF for reliability)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimateOn(true)),
    );

    setTimeout(() => {
      setNodes(prevNodes);
      setCurrentTitle(prevTitle ?? "All Categories");
      setPrevPanel(null);
      setNextPanel(null);
      setAnimateOn(false);
      setAnimating(false);
    }, ANIM_MS + 10);
  };

  const handleCategoryClick = (node: Category) => {
    if (animating) return;
    if (node.children && node.children.length > 0) {
      startForwardAnim(node.children, node.name?.en || node.slug);
    } else {
      // navigate to category page and close drawer
      const target = node.slug
        ? `/category/${node.slug}`
        : `/category/${node._id}`;
      closeCategory();
      router.push(target);
    }
  };

  const handleBack = () => {
    if (animating || stack.length === 0) return;
    const prev = stack[stack.length - 1];
    const newStack = stack.slice(0, -1);

    // compute previous title and update title stack
    const prevTitle =
      titleStack.length > 0
        ? titleStack[titleStack.length - 1]
        : "All Categories";
    const newTitleStack = titleStack.slice(0, -1);
    setTitleStack(newTitleStack);

    // animate back and update stack immediately
    startBackAnim(prev, prevTitle);
    setStack(newStack);
  };

  const customOrder = [
    "app-stores",
    "cryptocurrency",
    "ewallets-cards",
    "gaming-cards",
    "gaming-consoles",
    "game-keys",
    "marketplaces",
    "shopping",
    "software",
    "movies-music-platforms",
    "mobile-data",
    "fashion-accessories",
    "leisure-entertainment",
    "spa-wellness-procedures",
    "food-drinks",
    "others",
  ];

  const filteredNodes = nodes
  ?.filter((category) => category.slug !== "cryptocurrency")
  ?.sort((a, b) => {
    const aIndex = customOrder.indexOf(a.slug);
    const bIndex = customOrder.indexOf(b.slug);

    // keep items not in customOrder at the end
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });


  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out"
          onClick={closeCategory}
          style={{ opacity: isOpen ? 1 : 0 }}
          aria-hidden="true"
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Categories"
        className={`fixed inset-y-0 left-0 z-50 w-full md:w-104.75 bg-white dark:bg-[#0B0B0B] shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 bg-primary text-white relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              {stack.length > 0 ? (
                <button
                  onClick={handleBack}
                  className="p-2 rounded-md bg-primary/80 hover:bg-primary/90 text-white"
                  aria-label="Back"
                >
                  ←
                </button>
              ) : (
                <div className="p-2" aria-hidden="true" />
              )}
            </div>

            {/* centered title */}
            <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none w-3/4">
              <h3 className="font-medium text-white text-center truncate">
                {currentTitle}
              </h3>
            </div>

            <CloseButton
              ref={closeButtonRef}
              onClick={closeCategory}
              ariaLabel="Close drawer"
            />
          </div>

          <div className="relative flex-1 overflow-hidden">
            {/* Static / not animating view */}
            {!animating && (
              <div className="absolute inset-0 overflow-y-auto ">
                {loading ? (
                  <div className="space-y-2 p-2">
                    <div className="h-3 bg-gray-200 dark:bg-[#1B1B1B] rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-[#1B1B1B] rounded w-1/2 animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-[#1B1B1B] rounded w-2/3 animate-pulse" />
                  </div>
                ) : error ? (
                  <div className="p-4 text-sm text-red-600">{error}</div>
                ) : filteredNodes?.length === 0 ? (
                  <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    No categories found.
                  </div>
                ) : (
                  <ul className="">
                    {filteredNodes?.map((node) => (
                      <li key={node._id} className="">
                        <button
                          onClick={() => handleCategoryClick(node)}
                          className="w-full flex items-center gap-3 text-left px-4 sm:px-6 py-2.5 hover:bg-gray-50 dark:hover:bg-[#111111] rounded transition-colors duration-150 hover:text-primary"
                        >
                          {node.icon ? (
                            // render icon if available
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={node.icon}
                              alt=""
                              className="w-5 h-5 rounded"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded bg-primary/10 text-primary flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-primary"
                                viewBox="0 0 24 24"
                              >
                                <path d="M3 3h18v18H3z" fill="currentColor" />
                              </svg>
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="font-medium text-sm transition-colors duration-150 hover:text-primary">
                              {node.name?.en || node.slug || "Category"}
                            </div>
                          </div>

                          {node.children && node.children.length > 0 ? (
                            <div className="">›</div>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Animating view: render prev and next panels absolutely and animate them */}
            {animating && prevPanel && nextPanel && (
              <>
                <div
                  ref={(el) => setPrevPanelRef(el)}
                  className={`absolute inset-0 overflow-y-auto  transition-transform duration-300 ease-in-out transform-gpu will-change-transform ${
                    animating ? "pointer-events-none" : ""
                  } ${
                    direction === "forward"
                      ? animateOn
                        ? "-translate-x-full"
                        : "translate-x-0"
                      : animateOn
                        ? "translate-x-full"
                        : "translate-x-0"
                  }`}
                >
                  <ul className="">
                    {prevPanel.map((node) => (
                      <li key={node._id} className="">
                        <button className="w-full flex items-center gap-3 text-left px-4 sm:px-6 py-2.5 rounded opacity-60 transition-colors duration-150 hover:text-primary">
                          {node.icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={node.icon}
                              alt=""
                              className="w-5 h-5 rounded"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded bg-primary/10 text-primary flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-primary"
                                viewBox="0 0 24 24"
                              >
                                <path d="M3 3h18v18H3z" fill="currentColor" />
                              </svg>
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="font-medium text-sm transition-colors duration-150 hover:text-primary">
                              {node.name?.en || node.slug || "Category"}
                            </div>
                          </div>

                          {node.children && node.children.length > 0 ? (
                            <div className="">›</div>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  ref={(el) => setNextPanelRef(el)}
                  className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-in-out transform-gpu will-change-transform ${
                    animating ? "pointer-events-none" : ""
                  } ${
                    direction === "forward"
                      ? animateOn
                        ? "translate-x-0"
                        : "translate-x-full"
                      : animateOn
                        ? "translate-x-0"
                        : "-translate-x-full"
                  }`}
                >
                  <ul className="">
                    {nextPanel.map((node) => (
                      <li key={node._id} className="">
                        <button
                          onClick={() => handleCategoryClick(node)}
                          className="w-full flex items-center gap-3 text-left px-4 sm:px-6 py-2.5 hover:bg-gray-50 dark:hover:bg-[#111111] rounded transition-colors duration-150 hover:text-primary"
                        >
                          {node.icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={node.icon}
                              alt=""
                              className="w-5 h-5 rounded"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded bg-primary/10 text-primary flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-primary"
                                viewBox="0 0 24 24"
                              >
                                <path d="M3 3h18v18H3z" fill="currentColor" />
                              </svg>
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="font-medium text-sm transition-colors duration-150 hover:text-primary">
                              {node.name?.en || node.slug || "Category"}
                            </div>
                            {/* {node.children && node.children.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {node.children.length} subcategories
                              </div>
                            )} */}
                          </div>

                          {node.children && node.children.length > 0 ? (
                            <div className="text-gray-400">›</div>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
