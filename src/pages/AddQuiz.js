import React, { useEffect, useState } from "react";
import Select from "../components/UI/Select";
import Input from "../components/UI/Input";
import TextArea from "../components/UI/TextArea";
import Button from "../components/UI/Button";
import BackdropModal from "../components/UI/BackdropModal";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import InputFile from "../components/UI/InputFile";
import { useStateContext } from "../contexts/ContextProvider";
import { useContext } from "react";
import { GlobalContext } from "../contexts/FieldContext";
import Question from "../components/Question";

export default function AddQuiz() {
  const { quizCategories, updateCheck } = useStateContext();
  const navigate = useNavigate();
  const { fields, addField } = useContext(GlobalContext);
  const [showModal, setShowModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([{question:"", answer:""}]);
  const [paragraph, setParagraph] = useState("");
  const [answertext, setAnswertext] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [answer, setAnswer] = useState("True");
  const [questionCount, setQuestionCount] = useState(2);

  const logData = () => {
    console.log(fields);
  };

  let addQuestionField = ()=>{
    let question = document.getElementById("question1");
    let cloneQues = question.cloneNode(true);
    let para = document.getElementById("paragraph");
    cloneQues.id = ("question"+questionCount);
    cloneQues.firstChild.firstChild.innerHTML = "Question "+questionCount;
    question.parentNode.insertBefore(cloneQues,para);
    setQuestionCount(questionCount+1);
  }
  let updatedQuestions = (ques, index)=>{
    var quesList = questions;
    quesList[index].question = ques;
    console.log(questions[0]);
    return quesList;
  }
  let updatedAnswers = (ans, index)=>{
    var quesList = questions;
    quesList[index].answer = ans;
    console.log(questions);
    return quesList;
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    let path = "";
    if (selectedImage) {
      const appIconRef = ref(
        storage,
        `quiz_images/${selectedImage.name}-${new Date().getTime()}`
      );
      await uploadBytes(appIconRef, selectedImage);
      path = await getDownloadURL(appIconRef);
    }
    else {
      path = "https://firebasestorage.googleapis.com/v0/b/quiz-demo-f1989.appspot.com/o/quiz_images%2Fdefault-quiz.jpg-1661544342128?alt=media&token=2c0bd8c2-9d53-4025-a0b5-d31fcc52f993";
    }
    console.log(path);
    console.log("rases")

    try {
      const res=await addDoc(collection(db, "quizes"), {
        name: quizTitle,
        questions: fields,
        paragraph: paragraph,
        ansText: answertext,
        image: path,
        category: category,
        author: author,
        comment: comment,
        rating: 0,
        date: new Date(),
      });
      console.log("rases",res)
      updateCheck();
      setShowModal(true);
    } catch (error) {
      console.log("4error",error);
    }
  };

  return (
    <div className="w-full min-h-screen sm:max-w-screen-2xl px-6 sm:px-8 xl:px-6 xl:py-8 sm:mx-auto">
      <section>
        <div className="my-8 sm:flex items-center justify-between w-full">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-secondary-300"
              viewBox="0 0 34 34"
              fill="currentColor"
              onClick={()=>{
                navigate('/quiz')
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.4418 7.08325C15.722 7.08443 15.9955 7.16866 16.2278 7.32529C16.4601 7.48192 16.6408 7.70392 16.7469 7.96321C16.8531 8.22251 16.88 8.50746 16.8242 8.78203C16.7684 9.0566 16.6324 9.30845 16.4335 9.50575L9.91683 15.9941C9.78405 16.1258 9.67866 16.2825 9.60674 16.4551C9.53481 16.6277 9.49778 16.8129 9.49778 16.9999C9.49778 17.1869 9.53481 17.3721 9.60674 17.5447C9.67866 17.7174 9.78405 17.8741 9.91683 18.0058L16.4335 24.4941C16.5663 24.6258 16.6717 24.7825 16.7436 24.9551C16.8155 25.1278 16.8525 25.3129 16.8525 25.4999C16.8525 25.687 16.8155 25.8721 16.7436 26.0448C16.6717 26.2174 16.5663 26.3741 16.4335 26.5058C16.1681 26.7696 15.809 26.9177 15.4347 26.9177C15.0605 26.9177 14.7014 26.7696 14.436 26.5058L7.9335 20.0033C7.13762 19.2064 6.69058 18.1262 6.69058 16.9999C6.69058 15.8737 7.13762 14.7935 7.93351 13.9966L14.436 7.49409C14.5684 7.36279 14.7253 7.25891 14.898 7.18841C15.0706 7.11791 15.2554 7.08218 15.4418 7.08325Z" />
              <path d="M25.3583 7.08325C25.6385 7.08443 25.912 7.16866 26.1443 7.32529C26.3767 7.48192 26.5573 7.70392 26.6634 7.96321C26.7696 8.22251 26.7965 8.50746 26.7407 8.78203C26.6849 9.0566 26.5489 9.30845 26.35 9.50575L18.8558 16.9999L26.35 24.4941C26.4828 24.6258 26.5882 24.7825 26.6601 24.9551C26.732 25.1278 26.769 25.3129 26.769 25.4999C26.769 25.687 26.732 25.8721 26.6601 26.0448C26.5882 26.2174 26.4828 26.3741 26.35 26.5058C26.0846 26.7696 25.7255 26.9177 25.3512 26.9177C24.977 26.9177 24.6179 26.7696 24.3525 26.5058L15.8525 18.0058C15.7197 17.8741 15.6143 17.7174 15.5424 17.5447C15.4705 17.3721 15.4334 17.1869 15.4334 16.9999C15.4334 16.8129 15.4705 16.6277 15.5424 16.4551C15.6143 16.2825 15.7197 16.1258 15.8525 15.9941L24.3525 7.49409C24.4849 7.36279 24.6418 7.25891 24.8145 7.18841C24.9871 7.11791 25.1719 7.08218 25.3583 7.08325Z" />
            </svg>

            <h2 className="text-xxl sm:text-2xl text-primary-500 font-medium">
              Add Quiz
            </h2>
          </div>
        </div>
      </section>
      <form onSubmit={submitHandler} className="xl:flex justify-between gap-8">
        <div className="flex-auto">
          <div className="grid grid-cols-12 gap-y-3 sm:gap-y-8">
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Title</label>
              <p className="mt-1 sm:mt-2 text-xs text-white text-opacity-50">
                Enter title
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <Input
                required
                placeholder={"Type something ..."}
                value={quizTitle}
                onChange={(e) => {
                  setQuizTitle(e.target.value);
                }}
              />
            </div>
            <div className="col-span-10">
              Questions:
            </div>
            <div className="col-span-2 pl-4">
                <div onClick={addField} className="w-full flex items-center justify-center lg:justify-between px-3 bg-secondary-300 h-11 rounded-md cursor-pointer">
                  <p className="text-sm hidden lg:inline" >Add Question</p>
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 17 17"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    
                  >
                    <path d="M8.5 0C6.81886 0 5.17547 0.498516 3.77766 1.43251C2.37984 2.3665 1.29037 3.69402 0.647028 5.24719C0.00368293 6.80036 -0.164645 8.50943 0.163329 10.1583C0.491303 11.8071 1.30085 13.3217 2.4896 14.5104C3.67834 15.6991 5.1929 16.5087 6.84174 16.8367C8.49057 17.1646 10.1996 16.9963 11.7528 16.353C13.306 15.7096 14.6335 14.6202 15.5675 13.2223C16.5015 11.8245 17 10.1811 17 8.5C16.9976 6.24641 16.1013 4.08581 14.5077 2.49228C12.9142 0.898753 10.7536 0.00243743 8.5 0V0ZM8.5 15.5833C7.09905 15.5833 5.72956 15.1679 4.56471 14.3896C3.39987 13.6112 2.49198 12.505 1.95586 11.2107C1.41974 9.91636 1.27946 8.49214 1.55277 7.11811C1.82609 5.74408 2.50071 4.48195 3.49133 3.49133C4.48195 2.5007 5.74408 1.82608 7.11811 1.55277C8.49215 1.27946 9.91637 1.41973 11.2107 1.95585C12.505 2.49197 13.6113 3.39986 14.3896 4.56471C15.1679 5.72956 15.5833 7.09905 15.5833 8.5C15.5813 10.378 14.8343 12.1785 13.5064 13.5064C12.1785 14.8343 10.378 15.5813 8.5 15.5833ZM12.0417 8.5C12.0417 8.68786 11.967 8.86803 11.8342 9.00086C11.7014 9.1337 11.5212 9.20833 11.3333 9.20833H9.20834V11.3333C9.20834 11.5212 9.13371 11.7014 9.00087 11.8342C8.86803 11.967 8.68787 12.0417 8.5 12.0417C8.31214 12.0417 8.13198 11.967 7.99914 11.8342C7.8663 11.7014 7.79167 11.5212 7.79167 11.3333V9.20833H5.66667C5.47881 9.20833 5.29864 9.1337 5.1658 9.00086C5.03296 8.86803 4.95834 8.68786 4.95834 8.5C4.95834 8.31214 5.03296 8.13197 5.1658 7.99913C5.29864 7.86629 5.47881 7.79166 5.66667 7.79166H7.79167V5.66666C7.79167 5.4788 7.8663 5.29864 7.99914 5.1658C8.13198 5.03296 8.31214 4.95833 8.5 4.95833C8.68787 4.95833 8.86803 5.03296 9.00087 5.1658C9.13371 5.29864 9.20834 5.4788 9.20834 5.66666V7.79166H11.3333C11.5212 7.79166 11.7014 7.86629 11.8342 7.99913C11.967 8.13197 12.0417 8.31214 12.0417 8.5Z" />
                  </svg>
                </div>
              </div>
              {fields.map((field) => {
                return <Question key={field.id} fieldId={field.id} />;
              })}
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100" id="paragraph">
              <label className="">Paragraph</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Enter a paragraph upto 500 characters
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <TextArea
                required
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
                Enter Answer Text
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <Input
                required
                placeholder={"Type something ..."}
                value={answertext}
                onChange={(e) => {
                  setAnswertext(e.target.value);
                }}
              />
            </div>
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Image</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Upload image of your quiz
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
            </div>
            <div className="col-span-12 sm:col-span-5 sm:pb-8 sm:border-b sm:border-b-primary-100">
              <label className="">Author</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Enter the author
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <Input
                required
                placeholder={"Type something ..."}
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
              />
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
                required
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
              <label className="">Answer</label>
              <p className="mt-2 text-xs text-white text-opacity-50">
                Choose the right answer
              </p>
            </div>
            <div className="col-span-12 sm:col-span-7 pb-6 sm:pb-8 border-b border-b-primary-100">
              <Select
                alt
                required
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                }}
              >
                <option value="True">
                  <span style={{ color: "red"}}>&#10004; </span>
                  True
                </option>
                <option value="False">
                <span style={{ color: "green"}}>&#10005; </span>
                  False
                </option>
              </Select>
            </div> */}
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
