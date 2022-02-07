import axios from "axios";
import { URLS } from "../../appConfig";
import { getCookie } from "../../services/cookies/cookies";
import BookEntry from "../../types/bookEntry";
import axiosInstance from "./axiosConfig/axiosConfig";

const BOOKS = URLS.BOOKSHELF.BOOKS;

const getAll = (username: string) => {
    return axiosInstance.get(BOOKS + `/?username=${username}`, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} });
};

const getPurchasedBooks = () => {
    return axiosInstance.get(BOOKS + `/Purchased`, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} });
};

const getUpdates = (amount: number) => {
    return axios.get(BOOKS + `/LastUpdates?amount=${amount}`);
}

const getTopBooks = (amount: number) => {
    return axios.get(BOOKS + `/TopBooks?amount=${amount}`);
}

const post = async (data: BookEntry) => {
    const body = {
        title: data.title,
        authors: data.authors,
        publisher: data.publisher,
        status: data.status,
        score: data.score,
        googleBooksId: data.googleBooksId
    };

    return axiosInstance.post(BOOKS, body, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} });
};

const update = async (itemId: number, body: BookEntry) => {

    return axiosInstance.put(BOOKS + `/${itemId}`, body, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} });
};

const getById = async (itemId: number) => {

    return axiosInstance.get(BOOKS + `/${itemId}`, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} });
};

const getFile = async (type: string) => {
    return axiosInstance.get(BOOKS + `/File?type=${type}`, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} })
}
const remove = async (itemId: number) => {

    return axiosInstance.delete(BOOKS + `/${itemId}`, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} });
};

const books = {
    getAll,
    getPurchasedBooks,
    getUpdates,
    getTopBooks,
    post,
    update,
    getById,
    remove,
    getFile
};

export default books;
