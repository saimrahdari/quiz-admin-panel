import React, { useState } from "react";
import Select from "../components/UI/Select";
import phone3d from "../assets/images/phone3d.png";
import Input from "../components/UI/Input";
import TextArea from "../components/UI/TextArea";
import Rating from "../components/UI/Rating";
import Button from "../components/UI/Button";
import BackdropModal from "../components/UI/BackdropModal";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { isEditable } from "@testing-library/user-event/dist/utils";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase-config";
import { collection, doc, Timestamp, updateDoc } from "firebase/firestore";
import InputFile from "../components/UI/InputFile";

export default function EditQuiz() {
  const { selectedItemToEdit, quizCategories, updateCheck } = useStateContext();
  // console.log(selectedItemToEdit);

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [quizTitle, setQuizTitle] = useState(selectedItemToEdit?.name);
  const [paragraph, setParagraph] = useState(selectedItemToEdit?.paragraph);
  const [answertext, setAnswertext] = useState(selectedItemToEdit?.ansText);
  const [selectedImage, setSelectedImage] = useState("");
  const [category, setCategory] = useState(selectedItemToEdit?.category);
  const [author, setAuthor] = useState(selectedItemToEdit?.author);
  const [comment, setComment] = useState(selectedItemToEdit?.comment);
  const [rating, setRating] = useState(selectedItemToEdit?.rating);
  const [answer, setAnswer] = useState(selectedItemToEdit?.answer);

  const submitHandler = async (event) => {
    event.preventDefault();
    let path = "";
    if (selectedImage) {
      const imageRef = ref(
        storage,
        `quiz_images/${selectedImage.name}-${new Date().getTime()}`
      );
      await uploadBytes(imageRef, selectedImage);
      path = await getDownloadURL(imageRef);
    }
    // console.log(imageRef);
    try {
      const data = doc(collection(db, "quizes"), selectedItemToEdit?.id);
      const res = await updateDoc(data, {
        name: quizTitle,
        paragraph: paragraph,
        ansText: answertext,
        ...(selectedImage
          ? { image: path }
          : { image: selectedItemToEdit?.image }),
        category: category,
        author: author,
        comment: comment,
        answer: answer,
      });

      console.log("resupdate", res);
      updateCheck();
      navigate("/quiz");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen sm:max-w-screen-2xl px-6 sm:px-8 xl:px-6 xl:py-8 sm:mx-auto">
      <section>
        <div className="mt-6 sm:mt-0 text-end">
          <form className="relative flex items-center md:flex-row w-full sm:w-fit md:space-x-3 md:space-y-0 ">
            <svg
              className="object-contain w-4 h-4 text-inherit "
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.71 16.29L14.31 12.9C15.407 11.5025 16.0022 9.77666 16 8C16 6.41775 15.5308 4.87103 14.6518 3.55544C13.7727 2.23985 12.5233 1.21447 11.0615 0.608967C9.59966 0.00346625 7.99113 -0.15496 6.43928 0.153721C4.88743 0.462403 3.46197 1.22433 2.34315 2.34315C1.22433 3.46197 0.462403 4.88743 0.153721 6.43928C-0.15496 7.99113 0.00346625 9.59966 0.608967 11.0615C1.21447 12.5233 2.23985 13.7727 3.55544 14.6518C4.87103 15.5308 6.41775 16 8 16C9.77666 16.0022 11.5025 15.407 12.9 14.31L16.29 17.71C16.383 17.8037 16.4936 17.8781 16.6154 17.9289C16.7373 17.9797 16.868 18.0058 17 18.0058C17.132 18.0058 17.2627 17.9797 17.3846 17.9289C17.5064 17.8781 17.617 17.8037 17.71 17.71C17.8037 17.617 17.8781 17.5064 17.9289 17.3846C17.9797 17.2627 18.0058 17.132 18.0058 17C18.0058 16.868 17.9797 16.7373 17.9289 16.6154C17.8781 16.4936 17.8037 16.383 17.71 16.29ZM2 8C2 6.81332 2.3519 5.65328 3.01119 4.66658C3.67047 3.67989 4.60755 2.91085 5.7039 2.45673C6.80026 2.0026 8.00666 1.88378 9.17055 2.11529C10.3344 2.3468 11.4035 2.91825 12.2426 3.75736C13.0818 4.59648 13.6532 5.66558 13.8847 6.82946C14.1162 7.99335 13.9974 9.19975 13.5433 10.2961C13.0892 11.3925 12.3201 12.3295 11.3334 12.9888C10.3467 13.6481 9.18669 14 8 14C6.4087 14 4.88258 13.3679 3.75736 12.2426C2.63214 11.1174 2 9.5913 2 8Z"
                fill="white"
              />
            </svg>
            <input
              type="text"
              className="text-white py-3 pl-2 pr-8 bg-transparent w-full sm:w-fit border-0 outline-none ring-0 focus:ring-0"
              placeholder="Search ..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </form>
        </div>
        <div className="my-8 sm:flex items-center justify-between w-full">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-secondary-300"
              viewBox="0 0 34 34"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.4418 7.08325C15.722 7.08443 15.9955 7.16866 16.2278 7.32529C16.4601 7.48192 16.6408 7.70392 16.7469 7.96321C16.8531 8.22251 16.88 8.50746 16.8242 8.78203C16.7684 9.0566 16.6324 9.30845 16.4335 9.50575L9.91683 15.9941C9.78405 16.1258 9.67866 16.2825 9.60674 16.4551C9.53481 16.6277 9.49778 16.8129 9.49778 16.9999C9.49778 17.1869 9.53481 17.3721 9.60674 17.5447C9.67866 17.7174 9.78405 17.8741 9.91683 18.0058L16.4335 24.4941C16.5663 24.6258 16.6717 24.7825 16.7436 24.9551C16.8155 25.1278 16.8525 25.3129 16.8525 25.4999C16.8525 25.687 16.8155 25.8721 16.7436 26.0448C16.6717 26.2174 16.5663 26.3741 16.4335 26.5058C16.1681 26.7696 15.809 26.9177 15.4347 26.9177C15.0605 26.9177 14.7014 26.7696 14.436 26.5058L7.9335 20.0033C7.13762 19.2064 6.69058 18.1262 6.69058 16.9999C6.69058 15.8737 7.13762 14.7935 7.93351 13.9966L14.436 7.49409C14.5684 7.36279 14.7253 7.25891 14.898 7.18841C15.0706 7.11791 15.2554 7.08218 15.4418 7.08325Z" />
              <path d="M25.3583 7.08325C25.6385 7.08443 25.912 7.16866 26.1443 7.32529C26.3767 7.48192 26.5573 7.70392 26.6634 7.96321C26.7696 8.22251 26.7965 8.50746 26.7407 8.78203C26.6849 9.0566 26.5489 9.30845 26.35 9.50575L18.8558 16.9999L26.35 24.4941C26.4828 24.6258 26.5882 24.7825 26.6601 24.9551C26.732 25.1278 26.769 25.3129 26.769 25.4999C26.769 25.687 26.732 25.8721 26.6601 26.0448C26.5882 26.2174 26.4828 26.3741 26.35 26.5058C26.0846 26.7696 25.7255 26.9177 25.3512 26.9177C24.977 26.9177 24.6179 26.7696 24.3525 26.5058L15.8525 18.0058C15.7197 17.8741 15.6143 17.7174 15.5424 17.5447C15.4705 17.3721 15.4334 17.1869 15.4334 16.9999C15.4334 16.8129 15.4705 16.6277 15.5424 16.4551C15.6143 16.2825 15.7197 16.1258 15.8525 15.9941L24.3525 7.49409C24.4849 7.36279 24.6418 7.25891 24.8145 7.18841C24.9871 7.11791 25.1719 7.08218 25.3583 7.08325Z" />
            </svg>

            <h2 className="text-xxl sm:text-2xl text-primary-500 font-medium">
              Edit Quiz
            </h2>
          </div>
        </div>
      </section>
      <form onSubmit={submitHandler} className="xl:flex justify-between gap-8">
        <div className="flex-auto">
          <div className="grid grid-cols-12 gap-y-3 sm:gap-y-8">
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Quiz Title</label>
              <p className="mt-1 sm:mt-2 text-xs text-white text-opacity-50">
                Enter Quiz Title
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <Input
                placeholder={"Type something ..."}
                value={quizTitle}
                onChange={(e) => {
                  setQuizTitle(e.target.value);
                }}
              />
            </div>
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Paragraph</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Enter Paragraph up to 500 characters
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <TextArea
                rows={6}
                placeholder={"Type something ..."}
                value={paragraph}
                onChange={(e) => {
                  setParagraph(e.target.value);
                }}
              />
            </div>
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Answer Text</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Enter answer text
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <Input
                placeholder={"Type something ..."}
                value={answertext}
                onChange={(e) => {
                  setAnswertext(e.target.value);
                }}
              />
            </div>
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Author</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Enter Author name
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <Input
                placeholder={"Type something ..."}
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
              />
            </div>
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Image</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Update image of your quiz
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <InputFile
                imageName={selectedImage?.name}
                onChange={async (e) => {
                  setSelectedImage(e.target.files[0]);
                }}
                placeholder={"Upload Image"}
              />
              <p className="mt-1 text-white text-sm text-opacity-70">
                (Leave empty if you don't wish to change the image)
              </p>
            </div>
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Category</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Choose the right category
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <Select
                alt
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="">Select Category</option>
                {quizCategories.map((category) => (
                  <option value={category.name}>{category.name}</option>
                ))}
              </Select>
            </div>
            {/* <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Rating</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Select the rating and enter comment
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <div className="px-6 py-4 mb-2 bg-primary-100 rounded w-full">
                <Rating
                  rating={rating}
                  setRating={setRating}
                  isEditable={true}
                />
              </div>
              <TextArea
                rows={6}
                placeholder={"Comment here ..."}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </div> */}
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Answer</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Choose the right answer
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <Select
                alt
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                }}
              >
                <option value="True">True</option>
                <option value="False">False</option>
              </Select>
            </div>
          </div>
          <div className="hidden xl:flex mt-16 mb-8 gap-8">
            <button
              type="button"
              onClick={() => navigate("/quiz")}
              className="w-full px-8 py-3 rounded bg-primary-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full px-8 py-3 rounded bg-secondary-300"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex xl:hidden mt-16 mb-8 gap-8">
          <button
            type="button"
            onClick={() => navigate("/quiz")}
            className="w-full px-8 py-3 rounded bg-primary-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full px-8 py-3 rounded bg-secondary-300"
          >
            Save
          </button>
        </div>
      </form>
      <BackdropModal
        title="Successfully Saved"
        show={showModal}
        onClick={() => setShowModal(false)}
      >
        <p className="mb-6 text-center text-white text-opacity-50">
          Excel data contains standard daa input templates for KPIs. Please open
          the data sheet and input weekly actuals and targets.
        </p>
        <div className="flex justify-center">
          <div className="w-2/3">
            <Button
              secondaryAlt
              fullWidth
              type={"button"}
              onClick={() => {
                setShowModal(false);
                navigate("/quiz");
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </BackdropModal>
    </div>
  );
}
