import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Article = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const getData = async () => {
  const { data } = await axios.get<Article[]>(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return data;
};

const App = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["articles"],
    queryFn: getData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  if (isLoading) return <h1>로딩 중</h1>;
  if (error) return <h1>에러: {error.message}</h1>;

  return (
    <div>
      <h1>TanStack Query</h1>
      <button onClick={() => refetch()}>refetch</button>
      {data?.map((article) => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.body}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
