import React, { useContext } from 'react'
import axios from 'axios';
import {  Baseurl } from './BaseUrl';
import toast from 'react-hot-toast';




export default async function Axioscall(method, endpoint, datalist, header) {
  try {
    let base_url = Baseurl + '/' + endpoint;
    let data;

    if (method === "GET") {
      data = await axios.get(base_url, {
        params: datalist,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } else {
      let config = {
        method: method,
        url: base_url,
        data: datalist,
      };

      if (header) {
        config.headers = {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
      }

      data = await axios(config);
    }

    return data;

  } catch (error) {
    console.log("error", error);
    toast.error(error.response?.data?.message || "Server Error");

    if (error.response?.status === 403) {
      localStorage.clear();
      window.location.href = "/";
    }

    return {
      data: {
        success: false,
        message: error.response?.data?.message || "Unknown error"
      }
    };
  }
}

export const APIsCall = async (method, endpoint, data, params, is_formdata) => {
  var headers = {
    "Content-Type": is_formdata ? "multipart/form-data" : "application/json",
    "Authorization": "Bearer " + localStorage.getItem("craig-token")
  };
  var url = ApibaseURL+'/'+endpoint;

  try {
    const res = await axios({
      method,
      url,
      params,
      data,
      headers,
    });
    
    // var response = { status : true , message : res.data }
    // ShowToast(res.data.message , true)
    return res
  } catch (error) {
    toast.error(error.response ? error.response.data.message : 'Internal Server Error',false)
    return error;
  }
};
