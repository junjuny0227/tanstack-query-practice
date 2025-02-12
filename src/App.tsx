import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

type Article = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type ArticleInput = {
  title: string;
  body: string;
};

const getData = async () => {
  const { data } = await axios.get<Article[]>(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return data;
};

const postData = async ({ title, body }: ArticleInput) => {
  const { data } = await axios.post<Article>(
    "https://jsonplaceholder.typicode.com/posts",
    {
      title,
      body,
      userId: 1,
    }
  );
  return data;
};

const App = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["articles"],
    queryFn: getData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (data) setArticles(data);
  }, [data]);

  const { mutate } = useMutation({
    mutationFn: postData,
    onSuccess: (newArticle) => {
      setArticles((prev) => [newArticle, ...prev]);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ title, body });
    setTitle("");
    setBody("");
  };

  if (isLoading) return <h1>로딩 중</h1>;
  if (error) return <h1>에러: {error.message}</h1>;

  return (
    <div>
      <h1>TanStack Query</h1>
      <button onClick={() => refetch()}>refetch</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
        />
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="body"
        />
        <button>post</button>
      </form>
      {articles.map((article) => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.body}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
