import { useEffect, useState } from "react";
import { getAllPosts, getUserPosts } from "../../WebAPI";
import { useParams } from "react-router-dom";
import Intro from "../../components/Intro";
import Pagination from "../../components/Pagination";
import {
  HomePageRoot,
  HomeWrapper,
  ArchiveItem,
  ArchiveTitle,
} from "../../components/Home";

function ArchivePage() {
  let { slug } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [author, setAuthor] = useState(null);
  const [archivePosts, setArchivePosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [recentPosts, setRecentPosts] = useState([]);
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  // init
  useEffect(() => {
    // specific user posts
    if (slug) {
      getUserPosts(slug).then((response) => {
        if (response.posts.length > 0) {
          setUserPosts(response.posts.reverse());
        }
        setAuthor({
          nickname: response.nickname,
          postNum: response.posts.length,
        });
      });
    } else {
      // archive
      getAllPosts().then((posts) => {
        if (posts.length > 0) {
          let quotient = Math.ceil(posts.length / 5);
          if (!posts.length % 5) {
            quotient += 1;
          }
          setArchivePosts(posts);
          setCurrentPage(1);
          setTotalPage(quotient);
        }
      });
    }
  }, [slug]);

  // change pages
  useEffect(() => {
    const index = (currentPage - 1) * 5;
    setRecentPosts(archivePosts.slice(index, index + 5));
  }, [archivePosts, currentPage]);

  return (
    <HomePageRoot>
      <Intro />
      <HomeWrapper>
        {!slug && <ArchiveTitle>所有文章</ArchiveTitle>}
        {slug && author && (
          <ArchiveTitle>
            '{author.nickname}' 目前發表了 {author.postNum} 篇文章
          </ArchiveTitle>
        )}
        {recentPosts &&
          recentPosts.map((post) => <ArchiveItem key={post.id} post={post} />)}
        {slug &&
          userPosts.map((post) => <ArchiveItem key={post.id} post={post} />)}
        {!slug && recentPosts && totalPage && (
          <Pagination
            current={currentPage}
            total={totalPage}
            handleChangePage={handleChangePage}
          />
        )}
      </HomeWrapper>
    </HomePageRoot>
  );
}

export default ArchivePage;
