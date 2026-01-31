"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { adminApi, gamesApi, galleryApi } from "../../lib/api";
import { getImageUrl } from "../../lib/utils";
import { motion } from "framer-motion";
import {
  FiLogIn,
  FiLogOut,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";
import Image from "next/image";
import RichTextEditor from "../../components/RichTextEditor";

interface Game {
  _id: string;
  name: { uz: string; en: string; ru: string };
  shortDescription: { uz: string; en: string; ru: string };
  description: { uz: string; en: string; ru: string };
  images: string[];
  coverImage: string;
}

interface GalleryItem {
  _id: string;
  image: string;
  title?: { uz?: string; en?: string; ru?: string };
}

export default function AdminPage() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"games" | "gallery">("games");
  const [showGameForm, setShowGameForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [gameForm, setGameForm] = useState({
    name: { uz: "", en: "", ru: "" },
    shortDescription: { uz: "", en: "", ru: "" },
    description: { uz: "", en: "", ru: "" },
    images: [] as File[],
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        await adminApi.verify();
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("adminToken");
      }
    }
  };

  const fetchData = async () => {
    try {
      const [gamesRes, galleryRes] = await Promise.all([
        gamesApi.getAll(),
        galleryApi.getAll(),
      ]);
      setGames(gamesRes.data);
      setGallery(galleryRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await adminApi.login(username, password);
      localStorage.setItem("adminToken", response.data.token);
      setIsAuthenticated(true);
      setUsername("");
      setPassword("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setGames([]);
    setGallery([]);
  };

  const handleGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      if (editingGame) {
        // For updates, preserve existing images
        formData.append(
          "data",
          JSON.stringify({
            name: gameForm.name,
            shortDescription: gameForm.shortDescription,
            description: gameForm.description,
            existingImages: JSON.stringify(editingGame.images || []),
          }),
        );
      } else {
        // For new games
        formData.append(
          "data",
          JSON.stringify({
            name: gameForm.name,
            shortDescription: gameForm.shortDescription,
            description: gameForm.description,
          }),
        );
      }

      // Add new images
      gameForm.images.forEach((image) => {
        formData.append("images", image);
      });

      if (editingGame) {
        await gamesApi.update(editingGame._id, formData);
      } else {
        await gamesApi.create(formData);
      }

      await fetchData();
      setShowGameForm(false);
      setEditingGame(null);
      setGameForm({
        name: { uz: "", en: "", ru: "" },
        shortDescription: { uz: "", en: "", ru: "" },
        description: { uz: "", en: "", ru: "" },
        images: [],
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save game");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    try {
      await gamesApi.delete(id);
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete game");
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", JSON.stringify({}));
    formData.append("description", JSON.stringify({}));

    try {
      await galleryApi.create(formData);
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to upload image");
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await galleryApi.delete(id);
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete image");
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center py-12 bg-gray-50 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Admin Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
                title={
                  theme === "light"
                    ? "Switch to Dark Mode"
                    : "Switch to Light Mode"
                }
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("games")}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "games"
                  ? "border-b-2 border-primary-600 text-primary-600"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Games
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "gallery"
                  ? "border-b-2 border-primary-600 text-primary-600"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Gallery
            </button>
          </div>

          {/* Games Tab */}
          {activeTab === "games" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Games Management
                </h2>
                <button
                  onClick={() => {
                    setEditingGame(null);
                    setGameForm({
                      name: { uz: "", en: "", ru: "" },
                      shortDescription: { uz: "", en: "", ru: "" },
                      description: { uz: "", en: "", ru: "" },
                      images: [],
                    });
                    setShowGameForm(true);
                  }}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <FiPlus className="mr-2" />
                  Add Game
                </button>
              </div>

              {showGameForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-6 mb-6"
                >
                  <form onSubmit={handleGameSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(["uz", "en", "ru"] as const).map((lang) => (
                        <div key={lang}>
                          <label className="block text-sm font-medium mb-2">
                            Name ({lang.toUpperCase()})
                          </label>
                          <input
                            type="text"
                            value={gameForm.name[lang]}
                            onChange={(e) =>
                              setGameForm({
                                ...gameForm,
                                name: {
                                  ...gameForm.name,
                                  [lang]: e.target.value,
                                },
                              })
                            }
                            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800"
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(["uz", "en", "ru"] as const).map((lang) => (
                        <div key={lang}>
                          <label className="block text-sm font-medium mb-2">
                            Short Description ({lang.toUpperCase()})
                          </label>
                          <textarea
                            value={gameForm.shortDescription[lang]}
                            onChange={(e) =>
                              setGameForm({
                                ...gameForm,
                                shortDescription: {
                                  ...gameForm.shortDescription,
                                  [lang]: e.target.value,
                                },
                              })
                            }
                            className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800"
                            rows={3}
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(["uz", "en", "ru"] as const).map((lang) => (
                        <div key={lang}>
                          <label className="block text-sm font-medium mb-2">
                            Description ({lang.toUpperCase()})
                          </label>
                          <RichTextEditor
                            value={gameForm.description[lang]}
                            onChange={(value) =>
                              setGameForm({
                                ...gameForm,
                                description: {
                                  ...gameForm.description,
                                  [lang]: value,
                                },
                              })
                            }
                            placeholder={`Enter description in ${lang.toUpperCase()}...`}
                            className="min-h-[200px]"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Images (Multiple images allowed)
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setGameForm({
                            ...gameForm,
                            images: [...gameForm.images, ...files],
                          });
                        }}
                        className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
                      />
                      {gameForm.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {gameForm.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="relative h-32 w-full rounded-lg overflow-hidden">
                                <Image
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 50vw, 25vw"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = gameForm.images.filter(
                                    (_, i) => i !== index,
                                  );
                                  setGameForm({
                                    ...gameForm,
                                    images: newImages,
                                  });
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                              >
                                <FiX size={16} />
                              </button>
                              <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400 truncate">
                                {image.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      {editingGame &&
                        editingGame.images &&
                        editingGame.images.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">
                              Existing Images:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {editingGame.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <div className="relative h-32 w-full rounded-lg overflow-hidden">
                                    <Image
                                      src={getImageUrl(image)}
                                      alt={`Existing ${index + 1}`}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                      >
                        {editingGame ? "Update" : "Create"} Game
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowGameForm(false);
                          setEditingGame(null);
                        }}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <div key={game._id} className="glass rounded-2xl p-6">
                    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(game.coverImage)}
                        alt={game.name.uz}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {game.name.uz}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {game.shortDescription.uz}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingGame(game);
                          setGameForm({
                            name: game.name,
                            shortDescription: game.shortDescription,
                            description: game.description,
                            images: [],
                          });
                          setShowGameForm(true);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <FiEdit className="inline mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGame(game._id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <FiTrash2 className="inline mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Gallery Management
                </h2>
                <label className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition cursor-pointer">
                  <FiUpload className="mr-2" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <div key={item._id} className="relative group">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(item.image)}
                        alt="Gallery"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteGallery(item._id)}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
