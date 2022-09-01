import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase-config";

const useFetch = (collectionName, check) => {
  const [isloading, setIsloading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, orderBy("date", 'desc'));

    const fetchData = async () => {
      setIsloading(true);
      try {
        const fetchedData = await getDocs(q);
        setData(fetchedData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setIsloading(false);
      } catch (error) {
        console.log(error);
        setErrorMessage(error.message);
        alert(error);
      }
    };

    fetchData();
  }, [check]);

  return { data, isloading, errorMessage };
};

export default useFetch;
