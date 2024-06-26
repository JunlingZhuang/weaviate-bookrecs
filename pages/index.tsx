import { SyntheticEvent, useState, useEffect, useRef } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import Modal from "react-modal";
import { Book } from "types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book3D } from "@/components/ui/book3d";
import Typed from "typed.js";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "70%",
    height: "80%",
    transform: "translate(-50%, -50%)",
    borderRadius: "5px",
    backgroundColor: "black",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
};
export default function Home() {
  const [hoverStates, setHoverStates] = useState({});
  const handleMouseEnter = (isbn) => {
    setHoverStates((prev) => ({ ...prev, [isbn]: true }));
  };

  const handleMouseLeave = (isbn) => {
    setHoverStates((prev) => ({ ...prev, [isbn]: false }));
  };
  const [isLoading, setIsLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [query, setQuery] = useState("");
  const [userInterests, setUserInterests] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedBook, setSelectedbook] = useState<Book | undefined>(undefined);
  const el = useRef(null);
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Get personalized book recommendations based on your interests and hobbies!📚",
        "Try it out now!💡 ",
      ],
      typeSpeed: 50,
      backSpeed: 20,
      backDelay: 1000,

      showCursor: true,
      cursorChar: "_",
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  const openModal = (book_title: string) => {
    const bookSelection = recommendedBooks.filter((book: Book) => {
      return book.title === book_title;
    });
    console.log(bookSelection);
    setSelectedbook(bookSelection[0]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getRecommendations = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Check Inputs
    if (query.trim() === "") {
      alert("Please let us know what you'd like to learn!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          userInterests,
        }),
      });

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const { books } = await response.json();
      console.log("Recommendations:", books);

      if (books) {
        console.log("we found books!!!!!!!!!!!!!");
        setRecommendedBooks(books.map((book) => book.properties));
      } else {
        console.error("Unexpected response structure:", books);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
      setLoadedOnce(true);
    }
  };

  return (
    // <div className="min-h-screen bg-repeat bg-[url('../public/png/test_2.png')] flex flex-col justify-between bg-opacity-50 bg-blend-overlay">
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-between bg-opacity-50 bg-blend-overlay">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex justify-between ">
          <h3 className="mt-2 text-lg font-semibold text-neutral-100">
            {selectedBook?.title}
          </h3>
          <Button
            className="bg-black hover:font-bold border rounded hover:bg-gray-700 p-2 w-20 hover:bg-neutral-100 hover:text-black"
            onClick={closeModal}
          >
            Close
          </Button>
        </div>
        <div>
          <div className="flex justify-center py-10">
            <div className="w-48 h-72 ">
              <img
                src={selectedBook?.thumbnail}
                alt={"Thumbnail of the book " + selectedBook?.title}
                className="w-full h-full rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div className="text-neutral-100">
            <p className="mt-1">
              <span className="font-bold">Authors</span>:{" "}
              {selectedBook?.authors}
            </p>
            <p>
              <span className="font-bold">Genre</span>:{" "}
              {selectedBook?.categories}
            </p>
            <p>
              <span className="font-bold">Rating</span>:{" "}
              {selectedBook?.average_rating}
            </p>
            <p>
              <span className="font-bold">Publication Year</span>:{" "}
              {selectedBook?.published_year}
            </p>
            <br />
            <p>{selectedBook?.description}</p>

            <div className="flex justify-center">
              {/* <a
                className="hover:animate-pulse"
                target="_blank"
                href={"https://www.amazon.com/s?k=" + selectedBook?.isbn10}
              >
                <img
                  className="w-60"
                  src="https://kentuckynerd.com/wp-content/uploads/2019/05/amazon-buy-now-button.jpg"
                />
              </a> */}
              <Button
                className="bg-black mt-8 border text-white w-2/5 rounded-none hover:bg-neutral-100 hover:text-black"
                onClick={() =>
                  window.open(
                    "https://www.amazon.com/s?k=" + selectedBook?.isbn10,
                    "_blank"
                  )
                }
              >
                Buy on Amazon
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="mb-auto py-10 px-4 ">
        <div className="container mx-auto">
          <h1 className="text-3xl text-neutral-950 font-bold font-sans mb-6 text-center">
            Book Recommendations
          </h1>
          <h2 className="text-2xl text-neutral-950 font-normal text-center">
            <span ref={el}></span>
          </h2>
          <div className="border-t border-gray-500 my-4"></div>

          <form
            id="recommendation-form"
            className="px-4 mb-10 flex flex-col items-center "
            onSubmit={getRecommendations}
          >
            <div className="mb-4 w-full">
              <label
                htmlFor="favorite-books"
                className="block text-neutral-950 font-normal mb-2 text-center"
              >
                What would you like to get a book recommendation on?
              </label>
              <Input
                type="text"
                id="favorite-books"
                name="favorite-books"
                placeholder="I'd like to learn... (Enter keywords separated by commas or a whole sentence)"
                className="block w-full px-4 py-2 border border-white rounded-lg shadow-md shadow-neutral-400 bg-stone-900 text-neutral-300 focus:shadow-pink-100 hover:shadow-pink-200"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              {process.env.NEXT_PUBLIC_COHERE_CONFIGURED && (
                <>
                  <label
                    htmlFor="interests-input"
                    className="block text-neutral-950 font-normal mb-2 pt-4 text-center"
                  >
                    Your interests and hobbies?
                  </label>
                  <Input
                    type="text"
                    id="interests-input"
                    name="interests"
                    placeholder="Tell us about your hobbies and interests, comma separated..."
                    className="block w-full px-4 py-2 border border-white rounded-lg shadow-md shadow-neutral-400 bg-stone-900 text-neutral-300 focus:shadow-pink-100 hover:shadow-pink-200"
                    value={userInterests}
                    onChange={(e) => {
                      setUserInterests(e.target.value);
                    }}
                  />
                </>
              )}
            </div>
            <Button
              className=" bg-neutral-100 text-neutral-950 border border-neutral-300 w-full rounded-md hover:border-neutral-950 hover:bg-neutral-100"
              disabled={isLoading}
              type="submit"
              variant="outline"
            >
              Get Recommendations
            </Button>
          </form>
          <div className="border-t border-gray-500 my-4"></div>

          {isLoading ? (
            <div className="w-full flex items-center h-60 pt-10 flex-col ">
              <CircleLoader
                color={"#000000"}
                loading={isLoading}
                size={100}
                aria-label="Loading"
                data-testid="loader"
              />
              <div>
                Searching in the vector database wihch may takes up to 30s
              </div>
            </div>
          ) : (
            <>
              {loadedOnce ? (
                <>
                  <div
                    id="recommended-books"
                    className="flex overflow-hidden pb-10 hide-scroll-bar"
                  >
                    {/* <!-- Recommended books dynamically added here --> */}
                    <section className="container mx-0 mt-12 mb-12">
                      <div className="flex flex-wrap mx-2">
                        {recommendedBooks.map((book: Book) => {
                          return (
                            <div
                              key={book.isbn10 || book.isbn13}
                              className="w-full md:w-1/3 px-2 mb-4 animate-pop-in"
                            >
                              <div className="book-card  duration-150  hover:scale-105 bg-stone-900 rounded-lg border-solid border shadow-lg shadow-neutral-600 hover:shadow-lg hover:shadow-pink-100 p-6 flex items-center flex-col">
                                <div className="flex w-full justify-between">
                                  <h3 className="text-xl text-neutral-300 font-normal mb-4 line-clamp-1 text-center">
                                    {book.title}
                                  </h3>

                                  {/* {process.env.NEXT_PUBLIC_COHERE_CONFIGURED &&
                                    book._additional.generate.error !=
                                      "connection to Cohere API failed with status: 429" && ( */}
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button className="rounded-full border-solid border border-neutral-300 p-2 bg-black cursor-pointer w-10 h-10">
                                        ✨
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 h-80 overflow-auto">
                                      <div>
                                        <p className="text-2xl font-bold">
                                          Why you&apos;ll like this book:
                                        </p>
                                        <br />
                                        {/* <p>
                                              {
                                                book._additional.generate
                                                  .singleResult
                                              }
                                            </p> */}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                  {/* )} */}
                                </div>

                                <div
                                  className="image-container w-48 h-72 bg-stone-900"
                                  onMouseEnter={() =>
                                    handleMouseEnter(book.isbn10 || book.isbn13)
                                  }
                                  onMouseLeave={() =>
                                    handleMouseLeave(book.isbn10 || book.isbn13)
                                  }
                                >
                                  {hoverStates[book.isbn10 || book.isbn13] ? (
                                    <Book3D thumbnail={book.thumbnail} />
                                  ) : (
                                    <img
                                      src={book.thumbnail}
                                      alt={`Thumbnail of the book ${book.title}`}
                                      className="w-full h-full rounded-none shadow-lg"
                                    />
                                  )}
                                </div>
                                <p className="mt-4 text-neutral-100 line-clamp-1 mb-4">
                                  {book.authors}
                                </p>
                                <div className="flex">
                                  <Button
                                    className="bg-black text-white w-full rounded-none hover:bg-neutral-100 hover:text-black"
                                    type="submit"
                                    variant="outline"
                                    onClick={() => {
                                      openModal(book.title);
                                    }}
                                  >
                                    Learn More
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-center h-60 pt-10"></div>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="justify-center items-center text-neutral-950	 h-20 flex flex-col">
        <div>
          Deploy it on &nbsp;
          <a
            href="https://book-recommender-junling.vercel.app/"
            className="underline text-neutral-500"
          >
            Vercel
          </a>{" "}
          and checkout the code on{" "}
          <a
            href="https://github.com/JunlingZhuang/Book-recommender"
            className="underline text-neutral-500"
          >
            Github
          </a>
          .
        </div>
        <div>
          Made with 😶‍🌫️ by &nbsp;
          <a
            href="https://junlings-superb-site111.webflow.io/"
            target="_blank"
            className="underline text-neutral-500"
          >
            @Junling Zhuang
          </a>{" "}
          &nbsp; and built with &nbsp;
          <a
            target="_blank"
            href="https://weaviate.io/"
            className="underline text-neutral-500"
          >
            Weaviate
          </a>
          .
        </div>
      </footer>
    </div>
  );
}
