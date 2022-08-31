import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../assets/images/profile.png";
import DropdownB from "../components/UI/DropdownB";
import Rating from "../components/UI/Rating";
import Select from "../components/UI/Select";
import { useStateContext } from "../contexts/ContextProvider";
import { db } from "../firebase-config";
import convertDate from "../utility/convertDate";
import { filterByAnalytics,filterbySearch, filterBytype, sortRows } from "../utility/filter";
import image from './images.png'
import { Pagination } from "../utility/Pagination";


export default function Users() {
  const navigate = useNavigate();
  const { users, selectItemToEdit, updateCheck } = useStateContext();
  console.log(users);
  const [disabled, setDisabled] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [analytics, setAnalytics] = useState("All time");
  const [itemToSort, setItemToSort] = useState(null);
  const [operator, setOperator] = useState(null);
  const [type, setType] = useState("All");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter,setFilter]=useState('');
  const [currentPage , setCurrentPage] = useState(1);
  const [perPage] = useState(8);

  const indexOfLastData = currentPage * perPage;
  const indexOfFirstData = indexOfLastData - perPage;
  const currentData = filteredUsers.slice(indexOfFirstData, indexOfLastData)


  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const searchtext = (event) =>{
      setFilter(event.target.value);
  }
  const menu = [
    { name: "#", col: "2", isSortable: false },
    { name: "Image", value: "Image", col: "2", isSortable: true },
    { name: "Email", value: "email", col: "4", isSortable: true },
    { name: "Join Date", value: "joinDate", col: "2", isSortable: true },
    { name: "Activity", col: "2", isSortable: false, xPos: "center" },
  ];

  useEffect(() => {
    setFilteredUsers(filterByAnalytics(users, analytics));
  }, [analytics, users]);

  useEffect(() => {
    setFilteredUsers(filterBytype(users, type));
  }, [type, users]);

  useEffect(() => {
    if (itemToSort !== null) {
      setFilteredUsers(sortRows(filteredUsers, itemToSort, operator));
    }
  }, [itemToSort, operator,users]);

  useEffect(() => {
    setFilteredUsers(filterbySearch(users, filter));
  },[filter]);

  console.log("operator",operator);
  console.log("is",itemToSort);
  console.log("FU",filteredUsers);
  console.log("analytics",analytics);
  console.log("type",type);

  return (
    <div className="w-full min-h-screen sm:max-w-screen-2xl px-6 sm:px-8 xl:px-0 xl:py-6 sm:mx-auto">
      <div className="">
        <div className="hidden xl:block mt-6 sm:mt-0 text-end">
          <form className="pl-10 relative flex items-center md:flex-row w-full sm:w-fit md:space-x-3 md:space-y-0 ">
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
              value={filter}
              onChange={searchtext.bind(this)} 
            />
            
          </form>
        </div>
        <div className="my-8 space-y-4 xl:space-y-0 xl:flex items-center justify-between w-full">
          <div className="pl-10 mb-6 sm:mb-0 flex items-center">
            <svg
              className="w-8 h-8 text-secondary-300"
              viewBox="0 0 34 34"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.4418 7.08325C15.722 7.08443 15.9955 7.16866 16.2278 7.32529C16.4601 7.48192 16.6408 7.70392 16.7469 7.96321C16.8531 8.22251 16.88 8.50746 16.8242 8.78203C16.7684 9.0566 16.6324 9.30845 16.4335 9.50575L9.91683 15.9941C9.78405 16.1258 9.67866 16.2825 9.60674 16.4551C9.53481 16.6277 9.49778 16.8129 9.49778 16.9999C9.49778 17.1869 9.53481 17.3721 9.60674 17.5447C9.67866 17.7174 9.78405 17.8741 9.91683 18.0058L16.4335 24.4941C16.5663 24.6258 16.6717 24.7825 16.7436 24.9551C16.8155 25.1278 16.8525 25.3129 16.8525 25.4999C16.8525 25.687 16.8155 25.8721 16.7436 26.0448C16.6717 26.2174 16.5663 26.3741 16.4335 26.5058C16.1681 26.7696 15.809 26.9177 15.4347 26.9177C15.0605 26.9177 14.7014 26.7696 14.436 26.5058L7.9335 20.0033C7.13762 19.2064 6.69058 18.1262 6.69058 16.9999C6.69058 15.8737 7.13762 14.7935 7.93351 13.9966L14.436 7.49409C14.5684 7.36279 14.7253 7.25891 14.898 7.18841C15.0706 7.11791 15.2554 7.08218 15.4418 7.08325Z" />
              <path d="M25.3583 7.08325C25.6385 7.08443 25.912 7.16866 26.1443 7.32529C26.3767 7.48192 26.5573 7.70392 26.6634 7.96321C26.7696 8.22251 26.7965 8.50746 26.7407 8.78203C26.6849 9.0566 26.5489 9.30845 26.35 9.50575L18.8558 16.9999L26.35 24.4941C26.4828 24.6258 26.5882 24.7825 26.6601 24.9551C26.732 25.1278 26.769 25.3129 26.769 25.4999C26.769 25.687 26.732 25.8721 26.6601 26.0448C26.5882 26.2174 26.4828 26.3741 26.35 26.5058C26.0846 26.7696 25.7255 26.9177 25.3512 26.9177C24.977 26.9177 24.6179 26.7696 24.3525 26.5058L15.8525 18.0058C15.7197 17.8741 15.6143 17.7174 15.5424 17.5447C15.4705 17.3721 15.4334 17.1869 15.4334 16.9999C15.4334 16.8129 15.4705 16.6277 15.5424 16.4551C15.6143 16.2825 15.7197 16.1258 15.8525 15.9941L24.3525 7.49409C24.4849 7.36279 24.6418 7.25891 24.8145 7.18841C24.9871 7.11791 25.1719 7.08218 25.3583 7.08325Z" />
            </svg>

            <h2 className="text-xl sm:text-2xl text-primary-500 font-medium">
              Users
            </h2>
          </div>
          <div className="sm:flex sm:flex-wrap gap-4">
            <div className="mb-3 sm:mb-0 space-y-1 sm:space-y-0 sm:flex items-center gap-3">
              <label>Show Analytics for: </label>
              <Select
                value={analytics}
                onChange={(e) => {
                  setAnalytics(e.target.value);
                }}
              >
                <option value={"All time"}>All time</option>
                <option value={"This week"}>This week</option>
                <option value={"This month"}>This month</option>
              </Select>
            </div>
            <div className="mb-6 sm:mb-0 space-y-1 sm:space-y-0 sm:flex items-center gap-3">
              <label>Type:</label>
              <Select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                <option value={"All"}>All</option>
                {/* <option value={"This week"}>This week</option>
                <option value={"This month"}>This month</option> */}
              </Select>
            </div>
            <button
              onClick={() => navigate("/add-user")}
              style={{marginRight:10}}
              className="w-full sm:w-44 px-3 py-3 xl:py-2 flex items-center justify-between bg-secondary-300 rounded"
            >
              <p className="text-sm">Add Users</p>
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 17 17"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.5 0C6.81886 0 5.17547 0.498516 3.77766 1.43251C2.37984 2.3665 1.29037 3.69402 0.647028 5.24719C0.00368293 6.80036 -0.164645 8.50943 0.163329 10.1583C0.491303 11.8071 1.30085 13.3217 2.4896 14.5104C3.67834 15.6991 5.1929 16.5087 6.84174 16.8367C8.49057 17.1646 10.1996 16.9963 11.7528 16.353C13.306 15.7096 14.6335 14.6202 15.5675 13.2223C16.5015 11.8245 17 10.1811 17 8.5C16.9976 6.24641 16.1013 4.08581 14.5077 2.49228C12.9142 0.898753 10.7536 0.00243743 8.5 0V0ZM8.5 15.5833C7.09905 15.5833 5.72956 15.1679 4.56471 14.3896C3.39987 13.6112 2.49198 12.505 1.95586 11.2107C1.41974 9.91636 1.27946 8.49214 1.55277 7.11811C1.82609 5.74408 2.50071 4.48195 3.49133 3.49133C4.48195 2.5007 5.74408 1.82608 7.11811 1.55277C8.49215 1.27946 9.91637 1.41973 11.2107 1.95585C12.505 2.49197 13.6113 3.39986 14.3896 4.56471C15.1679 5.72956 15.5833 7.09905 15.5833 8.5C15.5813 10.378 14.8343 12.1785 13.5064 13.5064C12.1785 14.8343 10.378 15.5813 8.5 15.5833ZM12.0417 8.5C12.0417 8.68786 11.967 8.86803 11.8342 9.00086C11.7014 9.1337 11.5212 9.20833 11.3333 9.20833H9.20834V11.3333C9.20834 11.5212 9.13371 11.7014 9.00087 11.8342C8.86803 11.967 8.68787 12.0417 8.5 12.0417C8.31214 12.0417 8.13198 11.967 7.99914 11.8342C7.8663 11.7014 7.79167 11.5212 7.79167 11.3333V9.20833H5.66667C5.47881 9.20833 5.29864 9.1337 5.1658 9.00086C5.03296 8.86803 4.95834 8.68786 4.95834 8.5C4.95834 8.31214 5.03296 8.13197 5.1658 7.99913C5.29864 7.86629 5.47881 7.79166 5.66667 7.79166H7.79167V5.66666C7.79167 5.4788 7.8663 5.29864 7.99914 5.1658C8.13198 5.03296 8.31214 4.95833 8.5 4.95833C8.68787 4.95833 8.86803 5.03296 9.00087 5.1658C9.13371 5.29864 9.20834 5.4788 9.20834 5.66666V7.79166H11.3333C11.5212 7.79166 11.7014 7.86629 11.8342 7.99913C11.967 8.13197 12.0417 8.31214 12.0417 8.5Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full xl:w-full py-6 px-3  grid grid-cols-12 text-base text-left bg-primary-100">
            {menu.map((item) => {
              return (
                <h3
                  key={item.name}
                  className={`col-span-${item.col} flex items-center gap-2 
                  ${item.xPos ? `justify-${item.xPos}` : "justify-start"} `}
                  onClick={() => {
                    console.log("ietmshg",item.value)
                    setItemToSort(item.value);
                    operator === null && setOperator("ascending");
                    operator === "ascending" && setOperator("descending");
                    operator === "descending" && setOperator("ascending");
                  }}
                >
                  {item.name}

                  {item.isSortable && itemToSort === item.value ? (
                    <svg
                      className={`h-2 w-2 ${
                        operator === "descending"
                          ? "rotate-180"
                          : operator === null
                          ? "opacity-100"
                          : "rotate-0 opacity-100"
                      } `}
                      viewBox="0 0 8 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.36029 4.62558C4.16359 4.82999 3.83641 4.82999 3.63971 4.62558L0.484598 1.34669C0.178938 1.02904 0.404057 0.5 0.844887 0.5L7.15511 0.500001C7.59594 0.500001 7.82106 1.02904 7.5154 1.34669L4.36029 4.62558Z"
                        fill="#656EE7"
                      />
                    </svg>
                  ) : (
                    item.isSortable && (
                      <svg
                        className={`h-2 w-2 opacity-100`}
                        viewBox="0 0 8 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.36029 4.62558C4.16359 4.82999 3.83641 4.82999 3.63971 4.62558L0.484598 1.34669C0.178938 1.02904 0.404057 0.5 0.844887 0.5L7.15511 0.500001C7.59594 0.500001 7.82106 1.02904 7.5154 1.34669L4.36029 4.62558Z"
                          fill="#656EE7"
                        />
                      </svg>
                    )
                  )}
                </h3>
              );
            })}
          </div>
          <div className="w-full xl:w-full ">
            {currentData.map((user) => {
              return (
                <div
                  key={user.id}
                  className={`w-full grid grid-cols-12 text-left hover:bg-primary-100 text-sm sm:text-base px-3 py-6 sm:px-4 group rounded ${
                    user.isDisabled ? "opacity-50" : "opacity-100"
                  } border-b border-b-primary-100 text-secondary-100 items-center`}
                >
                  <div className="col-span-2 flex items-center">
                    <div className="h-5 w-5 bg-primary-100 rounded group-hover:bg-secondary-300" />
                  </div>
                  <div className="col-span-2 flex flex-row gap-2 items-center">
                  <img
                      className="object-cover h-8 w-8 rounded-full"
                      src={image}
                      alt=""
                    />
                  <p>{user.name}</p>
                  </div>
                  <p className="col-span-4 py-3 text-left">{user.email}</p>
                  <div className="col-span-2">{new Date(user.date.seconds * 1000).toISOString().slice(0, 10)}</div>
                  <button
                    onClick={() => {
                      selectedItem !== null
                        ? setSelectedItem(null)
                        : setSelectedItem(user);
                    }}
                    className="col-span-1 flex justify-center"
                  >
                    <DropdownB id={user.id} selectedItem={selectedItem}>
                      <div
                        onClick={() => {
                          selectItemToEdit(user);
                          navigate("/edit-users");
                        }}
                        className="flex gap-3 hover:bg-primary-200"
                      >
                        <div className="bg-primary-200 p-2">
                          <svg
                            className="h-3 w-3"
                            viewBox="0 0 9 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.80855 0.376026C7.05038 0.140422 7.37528 0.00954907 7.7129 0.011746C8.05052 0.0139429 8.37369 0.149033 8.61243 0.387764C8.85117 0.626495 8.98626 0.949653 8.98846 1.28726C8.99066 1.62487 8.85978 1.94976 8.62417 2.19158L2.49647 8.31907L0 8.9999L0.680855 6.50352L6.80855 0.376026Z"
                              fill="#D67C29"
                            />
                          </svg>
                        </div>

                        <p className="text-left">edit</p>
                      </div>
                      <div
                        onClick={async () => {
                           await deleteDoc(
                            doc(collection(db, "users"), user.id)
                          );
                          updateCheck(); 
                          navigate("/users");
                        }}
                        className="flex gap-3 hover:bg-primary-200"
                      >
                        <div className="bg-primary-200 p-2">
                          <svg
                            className="w-3 h-3"
                            viewBox="0 0 9 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.853157 8.89184C0.632502 8.90467 0.415497 8.83132 0.2479 8.68725C-0.0826333 8.35475 -0.0826333 7.81774 0.2479 7.48524L7.4855 0.247614C7.82928 -0.074076 8.36873 -0.0561934 8.69042 0.28759C8.98132 0.598473 8.99827 1.07631 8.73012 1.40701L1.44988 8.68725C1.28444 8.82924 1.07092 8.90246 0.853157 8.89184Z"
                              fill="#EA2828"
                            />
                            <path
                              d="M8.08233 8.89186C7.8587 8.89091 7.64436 8.80214 7.48558 8.64465L0.247953 1.407C-0.0582687 1.0494 -0.0166362 0.51124 0.34096 0.20499C0.660123 -0.06833 1.13083 -0.06833 1.44996 0.20499L8.7302 7.44261C9.0739 7.76439 9.09167 8.30387 8.7699 8.64757C8.75709 8.66124 8.74387 8.67446 8.7302 8.68726C8.55194 8.84228 8.31733 8.91637 8.08233 8.89186Z"
                              fill="#EA2828"
                            />
                          </svg>
                        </div>
                        <p className="text-left">Remove</p>
                      </div>
                    </DropdownB>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Pagination perPage={perPage} totalData={filteredUsers.length} paginate={paginate} currentPage={currentPage}/>
    </div>
  );
}
