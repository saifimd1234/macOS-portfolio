import { ArrowUpRight, Search } from "lucide-react";
import { blogPosts } from "#constants";
import Window from "./Window";

const Safari = (props) => (
  <Window {...props} className="safari" title="Articles">
    <div className="safari-bar">
      <div className="search">
        <Search className="size-4 text-gray-400" />
        <input placeholder="Search articles" />
      </div>
    </div>

    <div className="blog">
      <h2>Latest Articles</h2>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="blog-post">
            <div className="col-span-2">
              <img src={post.image} alt={post.title} loading="lazy" />
            </div>
            <div className="content">
              <p>{post.date}</p>
              <h3>{post.title}</h3>
              <a href={post.link} target="_blank" rel="noopener noreferrer">
                Read article <ArrowUpRight className="size-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </Window>
);

export default Safari;
