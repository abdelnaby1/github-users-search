import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithunUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    toggleError();
    setLoading(true);
    try {
      const res = await axios(`${rootUrl}/users/${user}`);
      const { login, followers_url } = res.data;
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ]).then((results) => {
        const [repos, followers] = results;
        if (repos.status === "fulfilled") {
          setRepos(repos.value.data);
        }
        if (followers.status === "fulfilled") {
          setFollowers(followers.value.data);
        }
      });
      setLoading(false);
      setGithunUser(res.data);
    } catch (error) {
      setLoading(false);
      toggleError(true, "there is no user with that username");
    }
  };
  const checkRequests = async () => {
    try {
      const data = await axios.get(`${rootUrl}/rate_limit`);
      let {
        rate: { remaining },
      } = data.data;
      setRequests(remaining);
      if (remaining === 0) {
        toggleError(true, "sorry,you have exceeded your hourly rate limit!");
      }
    } catch (error) {}
  };
  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }
  useEffect(() => {
    checkRequests();
  }, [githubUser]);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export const useGlobalContext = () => {
  return React.useContext(GithubContext);
};

export { GithubContext, GithubProvider };
