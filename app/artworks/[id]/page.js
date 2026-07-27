"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Pencil, Trash2 } from "lucide-react";
import { api, money } from "../../../lib/api";
import { authClient } from "../../../lib/auth-client";

export default function ArtworkDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [artwork, setArtwork] = useState(null);
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentPermission, setCommentPermission] = useState({
    canComment: false,
    reason: "Login to check comment permission."
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    Promise.all([api(`/artworks/${id}`), api(`/artworks/${id}/comments`)])
      .then(([artworkData, commentData]) => {
        setArtwork(artworkData);
        setComments(commentData);
      })
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!session?.user || !id) {
      setCommentPermission({
        canComment: false,
        reason: "Login first. Only buyers who purchased this artwork can comment."
      });
      return;
    }

    api(`/artworks/${id}/comment-permission`)
      .then(setCommentPermission)
      .catch((err) => {
        setCommentPermission({
          canComment: false,
          reason: err.message
        });
      });
  }, [id, session?.user]);

  useEffect(() => {
    if (!session?.user) { setProfile(null); return; }
    api("/profile/me").then(setProfile).catch(() => setProfile(null));
  }, [session?.user]);

  async function buyArtwork() {
    try {
      const data = await api("/checkout/purchase", {
        method: "POST",
        body: JSON.stringify({ artworkId: id })
      });

      if (data.url) window.location.href = data.url;
      else {
        setMessage(data.message || "Purchase completed.");
        const [updatedArtwork, updatedPermission] = await Promise.all([
          api(`/artworks/${id}`),
          api(`/artworks/${id}/comment-permission`)
        ]);
        setArtwork(updatedArtwork);
        setCommentPermission(updatedPermission);
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function submitComment(event) {
    event.preventDefault();
    try {
      const newComment = await api(`/artworks/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ comment })
      });
      setComments((current) => [newComment, ...current]);
      setComment("");
      setMessage("Comment posted.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function saveComment(commentId) {
    try {
      const updated = await api(`/artworks/${id}/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify({ comment: editCommentText })
      });
      setComments((current) =>
        current.map((c) => (c._id === commentId ? { ...c, comment: updated.comment ?? editCommentText } : c))
      );
      setEditingCommentId(null);
      setEditCommentText("");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function deleteComment(commentId) {
    if (!window.confirm("Delete this comment? This cannot be undone.")) return;
    try {
      await api(`/artworks/${id}/comments/${commentId}`, { method: "DELETE" });
      setComments((current) => current.filter((c) => c._id !== commentId));
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function deleteArtwork() {
    if (!window.confirm(`Delete "${artwork.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api(`/artworks/${id}`, { method: "DELETE" });
      router.push("/artworks");
    } catch (err) {
      setMessage(err.message);
      setDeleting(false);
    }
  }

  if (loading) {
    return <section className="section"><div className="card h-96 animate-pulse" /></section>;
  }

  if (!artwork) {
    return <section className="section"><div className="card p-8 text-center">Artwork not found.</div></section>;
  }

  const isOwner = profile && artwork && String(profile._id) === String(artwork.artist?._id);

  return (
    <section className="section">
      {message && <div className="card mb-5 border-emerald-200 bg-emerald-50 p-4 text-emerald-800">{message}</div>}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="h-full max-h-[620px] w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f5f5f4'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23a8a29e' font-size='18' font-family='sans-serif'%3EImage unavailable%3C/text%3E%3C/svg%3E";
              e.currentTarget.onError = null;
            }}
          />
        </div>

        <div>
          <p className="font-semibold text-emerald-700">{artwork.category}</p>
          <h1 className="mt-2 text-4xl font-black">{artwork.title}</h1>
          <p className="mt-3 text-stone-600">By <Link className="font-bold text-stone-950" href={`/artworks?search=${artwork.artist?.name || ""}`}>{artwork.artist?.name}</Link></p>
          <p className="mt-6 text-lg leading-8 text-stone-700">{artwork.description}</p>
          <div className="mt-6 flex items-center justify-between rounded-lg bg-white p-5 shadow-sm">
            <span className="text-sm font-semibold uppercase text-stone-500">Price</span>
            <span className="text-3xl font-black text-emerald-700">{money(artwork.price)}</span>
          </div>

          <button disabled={!session?.user || artwork.status === "sold" || isOwner} onClick={buyArtwork} className="btn btn-dark mt-5 w-full disabled:opacity-50">
            <ShoppingCart className="mr-2" size={18} />
            {artwork.status === "sold" ? "Sold" : isOwner ? "Your Artwork" : session?.user ? "Buy Now" : "Login to Purchase"}
          </button>

          {isOwner && (
            <div className="mt-5 flex gap-3">
              <Link href="/dashboard/artist" className="btn btn-light flex flex-1 items-center justify-center gap-2">
                <Pencil size={15} />
                Edit Artwork
              </Link>
              <button
                onClick={deleteArtwork}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
              >
                <Trash2 size={15} />
                {deleting ? "Deleting…" : "Delete Artwork"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={submitComment} className="card p-5">
          <h2 className="text-xl font-black">Leave a comment</h2>
          <p className="mt-2 text-sm text-stone-500">
            {session?.user && !commentPermission.canComment
              ? "Purchase this artwork to leave a comment."
              : commentPermission.reason}
          </p>
          <textarea
            className="field mt-4 min-h-28"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={session?.user ? "Write your comment" : "Login first to write a comment"}
            disabled={!session?.user || !commentPermission.canComment}
          />
          <button
            className="btn btn-dark mt-3 w-full disabled:opacity-50"
            disabled={!session?.user || !commentPermission.canComment || !comment.trim()}
          >
            Post Comment
          </button>
        </form>

        <div className="card p-5">
          <h2 className="text-xl font-black">Comments</h2>
          <div className="mt-4 grid gap-3">
            {comments.length ? comments.map((item) => {
              const isCommentOwner = profile && item.user?._id && String(item.user._id) === String(profile._id);
              const isEditing = editingCommentId === item._id;
              return (
                <div key={item._id} className="rounded border border-stone-200 p-3">
                  {isEditing ? (
                    <>
                      <textarea
                        className="field w-full text-sm"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => saveComment(item._id)}
                          disabled={!editCommentText.trim()}
                          className="btn btn-dark px-3 py-1 text-xs disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingCommentId(null); setEditCommentText(""); }}
                          className="btn btn-light px-3 py-1 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-stone-700">{item.comment}</p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-stone-500">{item.user?.name || "Collector"}</p>
                    {isCommentOwner && !isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingCommentId(item._id); setEditCommentText(item.comment); }}
                          className="btn btn-light flex items-center gap-1 px-2 py-1 text-xs"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        <button
                          onClick={() => deleteComment(item._id)}
                          className="flex items-center gap-1 rounded border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            }) : <p className="text-stone-500">No comments yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
