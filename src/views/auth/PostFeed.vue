<template>
  <link
    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    rel="stylesheet"
  />
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-900">E-Complain</span>
            </div>
            <nav class="hidden md:ml-6 md:flex md:space-x-8">
              <a
                href="#"
                class="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </a>
              <a
                href="#"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Trending
              </a>
              <a
                href="#"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                My Profile
              </a>
            </nav>
          </div>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <button
                @click="showNewPostForm = true"
                class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>New Post</span>
              </button>
            </div>
            <div class="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <div class="ml-3 relative">
                <div>
                  <button
                    class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span class="sr-only">Open user menu</span>
                    <div
                      class="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold"
                    >
                      {{ currentUser.name.charAt(0) }}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg p-4 sticky top-20">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Categories</h2>
              <div class="space-y-2">
                <button
                  @click="selectedCategory = null"
                  class="w-full text-left px-3 py-2 rounded-md text-sm font-medium"
                  :class="
                    selectedCategory === null
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  "
                >
                  All Categories
                </button>
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="selectedCategory = category.id"
                  class="w-full text-left px-3 py-2 rounded-md text-sm font-medium"
                  :class="
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  "
                >
                  {{ category.name }}
                </button>
              </div>

              <h2 class="text-lg font-medium text-gray-900 mt-6 mb-4">Sort By</h2>
              <div class="space-y-2">
                <button
                  @click="sortBy = 'newest'"
                  class="w-full text-left px-3 py-2 rounded-md text-sm font-medium"
                  :class="
                    sortBy === 'newest'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  "
                >
                  Newest
                </button>
                <button
                  @click="sortBy = 'trending'"
                  class="w-full text-left px-3 py-2 rounded-md text-sm font-medium"
                  :class="
                    sortBy === 'trending'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  "
                >
                  Most Raised
                </button>
                <button
                  @click="sortBy = 'mostComments'"
                  class="w-full text-left px-3 py-2 rounded-md text-sm font-medium"
                  :class="
                    sortBy === 'mostComments'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  "
                >
                  Most Discussed
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3 space-y-6">
            <!-- New Post Modal -->
            <div
              v-if="showNewPostForm"
              class="fixed inset-0 overflow-y-auto z-20"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div
                class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
              >
                <div
                  class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                  aria-hidden="true"
                  @click="showNewPostForm = false"
                ></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
                  >&#8203;</span
                >
                <div
                  class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                >
                  <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                          Share Your Concern
                        </h3>
                        <div class="mt-4 space-y-4">
                          <div>
                            <label for="title" class="block text-sm font-medium text-gray-700"
                              >Title</label
                            >
                            <input
                              type="text"
                              id="title"
                              v-model="newPost.title"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="What's your concern about?"
                              required
                            />
                          </div>
                          <div>
                            <label for="category" class="block text-sm font-medium text-gray-700"
                              >Category</label
                            >
                            <select
                              id="category"
                              v-model="newPost.categoryId"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            >
                              <option disabled value="">Select a category</option>
                              <option
                                v-for="category in categories"
                                :key="category.id"
                                :value="category.id"
                              >
                                {{ category.name }}
                              </option>
                            </select>
                          </div>
                          <div>
                            <label for="description" class="block text-sm font-medium text-gray-700"
                              >Description</label
                            >
                            <textarea
                              id="description"
                              v-model="newPost.description"
                              rows="4"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Describe your concern in detail"
                              required
                            ></textarea>
                          </div>
                          <div>
                            <label for="image" class="block text-sm font-medium text-gray-700"
                              >Attach Photo (Optional)</label
                            >
                            <input
                              type="file"
                              id="image"
                              accept="image/*"
                              @change="handleImageUpload"
                              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <div v-if="newPost.imageUrl" class="mt-2">
                              <p class="text-sm text-gray-500 mb-1">Preview:</p>
                              <img
                                :src="newPost.imageUrl"
                                alt="Preview"
                                class="h-32 object-cover rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      @click="addPost"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Post
                    </button>
                    <button
                      type="button"
                      @click="showNewPostForm = false"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selected Post Detail View -->
            <div v-if="selectedPost" class="bg-white shadow sm:rounded-lg overflow-hidden">
              <div class="px-4 py-5 sm:px-6 flex justify-between">
                <button
                  @click="selectedPost = null"
                  class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to feed
                </button>
              </div>

              <div class="border-t border-gray-200">
                <div class="px-4 py-5 sm:px-6">
                  <div class="flex items-center">
                    <div
                      class="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold"
                    >
                      {{ selectedPost.author.charAt(0) }}
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">{{ selectedPost.author }}</p>
                      <p class="text-sm text-gray-500">{{ formatDate(selectedPost.date) }}</p>
                    </div>
                    <div class="ml-auto">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        {{ getCategoryName(selectedPost.categoryId) }}
                      </span>
                    </div>
                  </div>
                  <h2 class="mt-4 text-xl font-bold text-gray-900">{{ selectedPost.title }}</h2>
                  <p class="mt-2 text-gray-700 whitespace-pre-line">
                    {{ selectedPost.description }}
                  </p>
                  <div v-if="selectedPost.imageUrl" class="mt-4">
                    <img
                      :src="selectedPost.imageUrl"
                      alt="Post image"
                      class="max-h-96 object-contain rounded-md"
                    />
                  </div>
                  <div class="mt-4 flex items-center space-x-4">
                    <button
                      @click="toggleLike(selectedPost)"
                      class="inline-flex items-center text-sm font-medium"
                      :class="
                        isLikedByCurrentUser(selectedPost)
                          ? 'text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 mr-1"
                        :fill="isLikedByCurrentUser(selectedPost) ? 'currentColor' : 'none'"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                        />
                      </svg>
                      {{ selectedPost.likes.length }}
                      {{ selectedPost.likes.length === 1 ? 'Raise' : 'Raises' }}
                    </button>
                    <span class="text-sm text-gray-500">
                      {{ selectedPost.comments.length }}
                      {{ selectedPost.comments.length === 1 ? 'Comment' : 'Comments' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Comment Form -->
              <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Add a Comment</h3>
                <form @submit.prevent="addComment" class="space-y-4">
                  <div>
                    <textarea
                      id="commentText"
                      v-model="newComment.text"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Write your comment here"
                      required
                    ></textarea>
                  </div>
                  <div class="flex justify-end">
                    <button
                      type="submit"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>

              <!-- Comments List -->
              <div class="border-t border-gray-200">
                <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 class="text-lg font-medium text-gray-900">Comments</h3>
                  <span
                    class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {{ selectedPost.comments.length }}
                    {{ selectedPost.comments.length === 1 ? 'Comment' : 'Comments' }}
                  </span>
                </div>
                <div class="border-t border-gray-200">
                  <div
                    v-if="selectedPost.comments.length === 0"
                    class="p-6 text-center text-gray-500"
                  >
                    No comments yet. Be the first to comment!
                  </div>
                  <ul v-else class="divide-y divide-gray-200">
                    <li
                      v-for="comment in selectedPost.comments"
                      :key="comment.id"
                      class="px-4 py-5 sm:px-6"
                    >
                      <div class="flex items-start">
                        <div
                          class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold"
                        >
                          {{ comment.author.charAt(0) }}
                        </div>
                        <div class="ml-3 flex-1">
                          <div class="flex justify-between">
                            <span class="font-medium text-gray-900">{{ comment.author }}</span>
                            <span class="text-sm text-gray-500">{{
                              formatDate(comment.date)
                            }}</span>
                          </div>
                          <p class="mt-1 text-gray-700">{{ comment.text }}</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Posts Feed -->
            <div v-else>
              <!-- Trending Posts -->
              <div
                v-if="sortBy === 'trending' && filteredPosts.length > 0"
                class="bg-white shadow sm:rounded-lg overflow-hidden mb-6"
              >
                <div class="px-4 py-5 sm:px-6">
                  <h2 class="text-lg font-medium text-gray-900 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-2 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    Most Raised Concerns
                  </h2>
                </div>
                <div class="border-t border-gray-200">
                  <div
                    class="px-4 py-5 sm:px-6 hover:bg-gray-50 cursor-pointer"
                    @click="selectPost(trendingPosts[0])"
                  >
                    <div class="flex items-center">
                      <div
                        class="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold"
                      >
                        {{ trendingPosts[0].author.charAt(0) }}
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">
                          {{ trendingPosts[0].author }}
                        </p>
                        <p class="text-sm text-gray-500">{{ formatDate(trendingPosts[0].date) }}</p>
                      </div>
                      <div class="ml-auto">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {{ getCategoryName(trendingPosts[0].categoryId) }}
                        </span>
                      </div>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">
                      {{ trendingPosts[0].title }}
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                      {{ trendingPosts[0].description }}
                    </p>
                    <div v-if="trendingPosts[0].imageUrl" class="mt-2">
                      <img
                        :src="trendingPosts[0].imageUrl"
                        alt="Post image"
                        class="h-48 w-full object-cover rounded-md"
                      />
                    </div>
                    <div class="mt-4 flex items-center space-x-4">
                      <button
                        @click.stop="toggleLike(trendingPosts[0])"
                        class="inline-flex items-center text-sm font-medium"
                        :class="
                          isLikedByCurrentUser(trendingPosts[0])
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-1"
                          :fill="isLikedByCurrentUser(trendingPosts[0]) ? 'currentColor' : 'none'"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                          />
                        </svg>
                        {{ trendingPosts[0].likes.length }}
                        {{ trendingPosts[0].likes.length === 1 ? 'Raise' : 'Raises' }}
                      </button>
                      <span class="text-sm text-gray-500 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                        {{ trendingPosts[0].comments.length }}
                        {{ trendingPosts[0].comments.length === 1 ? 'Comment' : 'Comments' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- All Posts -->
              <div class="bg-white shadow sm:rounded-lg overflow-hidden">
                <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 class="text-lg font-medium text-gray-900">
                    {{
                      selectedCategory
                        ? getCategoryName(selectedCategory) + ' Concerns'
                        : 'Recent Concerns'
                    }}
                  </h2>
                  <span
                    class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800"
                  >
                    {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'Post' : 'Posts' }}
                  </span>
                </div>
                <div class="border-t border-gray-200 divide-y divide-gray-200">
                  <div v-if="filteredPosts.length === 0" class="p-6 text-center text-gray-500">
                    No posts found in this category.
                  </div>
                  <div
                    v-for="post in filteredPosts"
                    :key="post.id"
                    class="px-4 py-5 sm:px-6 hover:bg-gray-50 cursor-pointer"
                    @click="selectPost(post)"
                  >
                    <div class="flex items-center">
                      <div
                        class="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold"
                      >
                        {{ post.author.charAt(0) }}
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ post.author }}</p>
                        <p class="text-sm text-gray-500">{{ formatDate(post.date) }}</p>
                      </div>
                      <div class="ml-auto">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {{ getCategoryName(post.categoryId) }}
                        </span>
                      </div>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">{{ post.title }}</h3>
                    <p class="mt-1 text-sm text-gray-600 line-clamp-2">{{ post.description }}</p>
                    <div v-if="post.imageUrl" class="mt-2">
                      <img
                        :src="post.imageUrl"
                        alt="Post image"
                        class="h-48 w-full object-cover rounded-md"
                      />
                    </div>
                    <div class="mt-4 flex items-center space-x-4">
                      <button
                        @click.stop="toggleLike(post)"
                        class="inline-flex items-center text-sm font-medium"
                        :class="
                          isLikedByCurrentUser(post)
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-1"
                          :fill="isLikedByCurrentUser(post) ? 'currentColor' : 'none'"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                          />
                        </svg>
                        {{ post.likes.length }} {{ post.likes.length === 1 ? 'Raise' : 'Raises' }}
                      </button>
                      <span class="text-sm text-gray-500 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                        {{ post.comments.length }}
                        {{ post.comments.length === 1 ? 'Comment' : 'Comments' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Current user (simplified for demo)
const currentUser = reactive({
  id: 'user1',
  name: 'Alex Johnson',
})

// Categories
const categories = [
  { id: 1, name: 'Infrastructure concern' },
  { id: 2, name: 'Environmental concern' },
  { id: 3, name: 'Security concern' },
  { id: 4, name: 'Noise Concern' },
  { id: 5, name: 'Health and sanitation' },
  { id: 6, name: 'Feature Requests' },
]

// Sample data
const posts = ref([
  {
    id: 1,
    title: 'Di gumagana ilaw sa poste',
    author: 'Jearah monggol',
    description:
      'di gumagana ilaw sa poste nato napaka dilikado maraming tumatambay na di taga dito sa lugar namin',
    date: new Date('2025-04-15T10:30:00'),
    imageUrl: '/src/assets/Poste.jpg',
    categoryId: 1,
    likes: ['user2', 'user3', 'user4'],
    comments: [
      {
        id: 1,
        author: 'Manny pacman',
        text: 'sana maayus na ang dilim kasi jan napaka dilikado',
        date: new Date('2025-04-15T14:22:00'),
      },
      {
        id: 2,
        author: 'Mohhammed Ali',
        text: 'nakakatakot mag lakad jan sa gabi',
        date: new Date('2025-04-16T09:15:00'),
      },
    ],
  },
  {
    id: 2,
    title: 'Puno na ang basura',
    author: 'Danilo Bituro',
    description:
      'Di kinuha ang basura napuno na ang trash bin isang buwan nato dito paki actionan po',
    date: new Date('2025-04-14T16:45:00'),
    imageUrl: '/src/assets/garbage.jpg',
    categoryId: 2,
    likes: ['user1', 'user3'],
    comments: [],
  },
  {
    id: 3,
    title: 'Suspicious people gathering',
    author: 'jhon Lui',
    description: '',
    date: new Date('2025-04-13T09:20:00'),
    imageUrl: '/src/assets/Security.jpg',
    categoryId: 3,
    likes: ['user2', 'user5', 'user6', 'user7', 'user8'],
    comments: [
      {
        id: 1,
        author: 'Maria leonora',
        text: 'dami nila jan ang iinom pa ang ingay',
        date: new Date('2025-04-13T10:15:00'),
      },
      {
        id: 2,
        author: 'John wick',
        text: 'halos gabi2 jan sila',
        date: new Date('2025-04-14T08:30:00'),
      },
    ],
  },
  {
    id: 4,
    title: 'Subrang ingay nakakadisturbo',
    author: 'Jeaine Collado',
    description: 'madaling araw na ang ingay pa din halos everyweek sila ganyan',
    date: new Date('2025-04-12T14:10:00'),
    imageUrl: '/src/assets/Party.jpg',
    categoryId: 4,
    likes: ['user1', 'user2', 'user3', 'user4'],
    comments: [
      {
        id: 1,
        author: 'Judas',
        text: 'halos everyweek ganyan sila',
        date: new Date('2025-04-12T15:45:00'),
      },
    ],
  },
])

// UI state
const selectedCategory = ref(null)
const selectedPost = ref(null)
const showNewPostForm = ref(false)
const sortBy = ref('newest')

// Form state
const newPost = reactive({
  title: '',
  author: currentUser.name,
  description: '',
  imageUrl: null,
  categoryId: '',
})

const newComment = reactive({
  text: '',
})

// Computed properties
const filteredPosts = computed(() => {
  let result = [...posts.value]

  // Filter by category if selected
  if (selectedCategory.value) {
    result = result.filter((post) => post.categoryId === selectedCategory.value)
  }

  // Sort posts
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.date) - new Date(a.date))
  } else if (sortBy.value === 'trending') {
    result.sort((a, b) => b.likes.length - a.likes.length)
  } else if (sortBy.value === 'mostComments') {
    result.sort((a, b) => b.comments.length - a.comments.length)
  }

  return result
})

const trendingPosts = computed(() => {
  return [...posts.value].sort((a, b) => b.likes.length - a.likes.length)
})

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getCategoryName = (categoryId) => {
  const category = categories.find((c) => c.id === categoryId)
  return category ? category.name : 'Uncategorized'
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.match('image.*')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newPost.imageUrl = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const addPost = () => {
  const post = {
    id: posts.value.length + 1,
    title: newPost.title,
    author: currentUser.name,
    description: newPost.description,
    imageUrl: newPost.imageUrl,
    date: new Date(),
    categoryId: parseInt(newPost.categoryId),
    likes: [],
    comments: [],
  }

  posts.value.unshift(post)

  // Reset form and close modal
  newPost.title = ''
  newPost.description = ''
  newPost.imageUrl = null
  newPost.categoryId = ''
  showNewPostForm.value = false
}

const selectPost = (post) => {
  selectedPost.value = post
}

const addComment = () => {
  const comment = {
    id: selectedPost.value.comments.length + 1,
    author: currentUser.name,
    text: newComment.text,
    date: new Date(),
  }

  selectedPost.value.comments.push(comment)

  // Reset form
  newComment.text = ''
}

const toggleLike = (post) => {
  const userIndex = post.likes.indexOf(currentUser.id)
  if (userIndex === -1) {
    // User hasn't liked the post yet, so add like
    post.likes.push(currentUser.id)
  } else {
    // User already liked the post, so remove like
    post.likes.splice(userIndex, 1)
  }
}

const isLikedByCurrentUser = (post) => {
  return post.likes.includes(currentUser.id)
}
</script>

<style>
/* Add any custom styles here */
/* The component already uses Tailwind CSS classes for styling */
</style>
