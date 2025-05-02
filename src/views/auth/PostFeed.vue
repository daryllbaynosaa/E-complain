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
                href="profile"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                My Profile
              </a>
            </nav>
          </div>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <button
                v-if="user"
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
              <button
                v-else
                @click="signIn"
                class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span>Sign In</span>
              </button>
            </div>
            <div class="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <div v-if="user" class="ml-3 relative">
                <div>
                  <button
                    class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    @click="toggleUserMenu"
                  >
                    <span class="sr-only">Open user menu</span>
                    <div
                      v-if="currentUserProfile && currentUserProfile.avatar_url"
                      class="h-8 w-8 rounded-full overflow-hidden"
                    >
                      <img
                        :src="currentUserProfile.avatar_url"
                        alt="User avatar"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div
                      v-else
                      class="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold"
                    >
                      {{ getUserInitials() }}
                    </div>
                  </button>
                </div>
                <div
                  v-if="showUserMenu"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Your Profile</a
                  >

                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Settings</a
                  >
                  <a
                    href="#"
                    @click.prevent="signOut"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Sign out</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                            <div v-if="newPost.imageFile" class="mt-2">
                              <p class="text-sm text-gray-500 mb-1">Preview:</p>
                              <img
                                :src="imagePreview"
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
                      :disabled="isSubmitting"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      <span v-if="isSubmitting" class="mr-2">
                        <svg
                          class="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
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
                      v-if="getPostProfile(selectedPost)?.avatar_url"
                      class="h-10 w-10 rounded-full overflow-hidden"
                    >
                      <img
                        :src="getPostProfile(selectedPost).avatar_url"
                        alt="User avatar"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div
                      v-else
                      class="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold"
                    >
                      {{ getPostAuthorInitial(selectedPost) }}
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">
                        {{ getPostAuthorName(selectedPost) }}
                      </p>
                      <p class="text-sm text-gray-500">{{ formatDate(selectedPost.created_at) }}</p>
                    </div>
                    <div class="ml-auto">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        {{ getCategoryName(selectedPost.category_id) }}
                      </span>
                    </div>
                  </div>
                  <h2 class="mt-4 text-xl font-bold text-gray-900">{{ selectedPost.title }}</h2>
                  <p class="mt-2 text-gray-700 whitespace-pre-line">
                    {{ selectedPost.description }}
                  </p>
                  <div v-if="selectedPost.image_url" class="mt-4">
                    <img
                      :src="selectedPost.image_url"
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
                      {{ postLikes[selectedPost.id]?.length || 0 }}
                      {{ (postLikes[selectedPost.id]?.length || 0) === 1 ? 'Raise' : 'Raises' }}
                    </button>
                    <span class="text-sm text-gray-500">
                      {{ postComments[selectedPost.id]?.length || 0 }}
                      {{
                        (postComments[selectedPost.id]?.length || 0) === 1 ? 'Comment' : 'Comments'
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Comment Form -->
              <div v-if="user" class="border-t border-gray-200 px-4 py-5 sm:px-6">
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
                      :disabled="isSubmittingComment"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <span v-if="isSubmittingComment" class="mr-2">
                        <svg
                          class="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>
              <div v-else class="border-t border-gray-200 px-4 py-5 sm:px-6 text-center">
                <p class="text-gray-500">
                  Please
                  <button @click="signIn" class="text-blue-600 font-medium">sign in</button> to
                  comment
                </p>
              </div>

              <!-- Comments List -->
              <div class="border-t border-gray-200">
                <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 class="text-lg font-medium text-gray-900">Comments</h3>
                  <span
                    class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {{ postComments[selectedPost.id]?.length || 0 }}
                    {{
                      (postComments[selectedPost.id]?.length || 0) === 1 ? 'Comment' : 'Comments'
                    }}
                  </span>
                </div>
                <div class="border-t border-gray-200">
                  <div
                    v-if="
                      !postComments[selectedPost.id] || postComments[selectedPost.id].length === 0
                    "
                    class="p-6 text-center text-gray-500"
                  >
                    No comments yet. Be the first to comment!
                  </div>
                  <ul v-else class="divide-y divide-gray-200">
                    <li
                      v-for="comment in postComments[selectedPost.id]"
                      :key="comment.id"
                      class="px-4 py-5 sm:px-6"
                    >
                      <div class="flex items-start">
                        <div
                          v-if="getCommentProfile(comment)?.avatar_url"
                          class="h-8 w-8 rounded-full overflow-hidden"
                        >
                          <img
                            :src="getCommentProfile(comment).avatar_url"
                            alt="User avatar"
                            class="h-full w-full object-cover"
                          />
                        </div>
                        <div
                          v-else
                          class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold"
                        >
                          {{ getCommentAuthorInitial(comment) }}
                        </div>
                        <div class="ml-3 flex-1">
                          <div class="flex justify-between">
                            <span class="font-medium text-gray-900">{{
                              getCommentAuthorName(comment)
                            }}</span>
                            <span class="text-sm text-gray-500">{{
                              formatDate(comment.created_at)
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
                v-if="sortBy === 'trending' && trendingPosts.length > 0"
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
                    v-if="trendingPosts.length > 0"
                    class="px-4 py-5 sm:px-6 hover:bg-gray-50 cursor-pointer"
                    @click="selectPost(trendingPosts[0])"
                  >
                    <div class="flex items-center">
                      <div
                        v-if="getPostProfile(trendingPosts[0])?.avatar_url"
                        class="h-10 w-10 rounded-full overflow-hidden"
                      >
                        <img
                          :src="getPostProfile(trendingPosts[0]).avatar_url"
                          alt="User avatar"
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div
                        v-else
                        class="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold"
                      >
                        {{ getPostAuthorInitial(trendingPosts[0]) }}
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">
                          {{ getPostAuthorName(trendingPosts[0]) }}
                        </p>
                        <p class="text-sm text-gray-500">
                          {{ formatDate(trendingPosts[0].created_at) }}
                        </p>
                      </div>
                      <div class="ml-auto">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {{ getCategoryName(trendingPosts[0].category_id) }}
                        </span>
                      </div>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">
                      {{ trendingPosts[0].title }}
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                      {{ trendingPosts[0].description }}
                    </p>
                    <div v-if="trendingPosts[0].image_url" class="mt-2">
                      <img
                        :src="trendingPosts[0].image_url"
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
                        {{ postLikes[trendingPosts[0].id]?.length || 0 }}
                        {{
                          (postLikes[trendingPosts[0].id]?.length || 0) === 1 ? 'Raise' : 'Raises'
                        }}
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
                        {{ postComments[trendingPosts[0].id]?.length || 0 }}
                        {{
                          (postComments[trendingPosts[0].id]?.length || 0) === 1
                            ? 'Comment'
                            : 'Comments'
                        }}
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
                        v-if="getPostProfile(post)?.avatar_url"
                        class="h-10 w-10 rounded-full overflow-hidden"
                      >
                        <img
                          :src="getPostProfile(post).avatar_url"
                          alt="User avatar"
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div
                        v-else
                        class="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold"
                      >
                        {{ getPostAuthorInitial(post) }}
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">
                          {{ getPostAuthorName(post) }}
                        </p>
                        <p class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</p>
                      </div>
                      <div class="ml-auto">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {{ getCategoryName(post.category_id) }}
                        </span>
                      </div>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">{{ post.title }}</h3>
                    <p class="mt-1 text-sm text-gray-600 line-clamp-2">{{ post.description }}</p>
                    <div v-if="post.image_url" class="mt-2">
                      <img
                        :src="post.image_url"
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
                        {{ postLikes[post.id]?.length || 0 }}
                        {{ (postLikes[post.id]?.length || 0) === 1 ? 'Raise' : 'Raises' }}
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
                        {{ postComments[post.id]?.length || 0 }}
                        {{ (postComments[post.id]?.length || 0) === 1 ? 'Comment' : 'Comments' }}
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
import { ref, reactive, computed, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// User state
const user = ref(null)
const showUserMenu = ref(false)
const currentUserProfile = ref(null)

// UI state
const loading = ref(true)
const selectedCategory = ref(null)
const selectedPost = ref(null)
const showNewPostForm = ref(false)
const sortBy = ref('newest')
const isSubmitting = ref(false)
const isSubmittingComment = ref(false)
const imagePreview = ref(null)

// Data state
const posts = ref([])
const postLikes = ref({})
const postComments = ref({})
const userProfiles = ref({}) // Store user profiles by ID

// Categories
const categories = [
  { id: 1, name: 'Infrastructure concern' },
  { id: 2, name: 'Environmental concern' },
  { id: 3, name: 'Security concern' },
  { id: 4, name: 'Noise Concern' },
  { id: 5, name: 'Health and sanitation' },
  { id: 6, name: 'Feature Requests' },
]

// Form state
const newPost = reactive({
  title: '',
  description: '',
  imageFile: null,
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
    result = result.filter((post) => post.category_id === selectedCategory.value)
  }

  // Sort posts
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortBy.value === 'trending') {
    result.sort(
      (a, b) => (postLikes.value[b.id]?.length || 0) - (postLikes.value[a.id]?.length || 0),
    )
  } else if (sortBy.value === 'mostComments') {
    result.sort(
      (a, b) => (postComments.value[b.id]?.length || 0) - (postComments.value[a.id]?.length || 0),
    )
  }

  return result
})

const trendingPosts = computed(() => {
  return [...posts.value].sort(
    (a, b) => (postLikes.value[b.id]?.length || 0) - (postLikes.value[a.id]?.length || 0),
  )
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
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

// Get profile for a post author
const getPostProfile = (post) => {
  if (!post || !post.user_id) return null
  return userProfiles.value[post.user_id] || null
}

// Get profile for a comment author
const getCommentProfile = (comment) => {
  if (!comment || !comment.user_id) return null
  return userProfiles.value[comment.user_id] || null
}

// New methods to handle user display
const getPostAuthorName = (post) => {
  // Check if post has user profile info
  const profile = getPostProfile(post)
  if (profile) {
    return profile.username || profile.full_name || 'User'
  }

  // Fallback to post.author if available
  if (post.author) {
    return post.author
  }

  // Final fallback
  return 'User'
}

const getPostAuthorInitial = (post) => {
  const name = getPostAuthorName(post)
  return name.charAt(0).toUpperCase()
}

const getCommentAuthorName = (comment) => {
  // Check if comment has user profile info
  const profile = getCommentProfile(comment)
  if (profile) {
    return profile.username || profile.full_name || 'User'
  }

  // Fallback to comment.author if available
  if (comment.author) {
    return comment.author
  }

  // Final fallback
  return 'User'
}

const getCommentAuthorInitial = (comment) => {
  const name = getCommentAuthorName(comment)
  return name.charAt(0).toUpperCase()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.match('image.*')) {
    newPost.imageFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// In your addPost function:
const addPost = async () => {
  if (!user.value) {
    alert('Please sign in to post')
    return
  }

  if (!newPost.title || !newPost.description || !newPost.categoryId) {
    alert('Please fill in all required fields')
    return
  }

  isSubmitting.value = true

  try {
    let imageUrl = null

    // Upload image if provided
    if (newPost.imageFile) {
      const fileExt = newPost.imageFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${user.value.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, newPost.imageFile)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('post-images').getPublicUrl(filePath)

      imageUrl = publicUrl
    }

    // Insert post
    const { error } = await supabase.from('posts').insert({
      title: newPost.title,
      description: newPost.description,
      image_url: imageUrl,
      category_id: parseInt(newPost.categoryId),
      user_id: user.value.id,
    })

    if (error) {
      throw error
    }

    // Reset form and close modal
    newPost.title = ''
    newPost.description = ''
    newPost.imageFile = null
    newPost.categoryId = ''
    imagePreview.value = null
    showNewPostForm.value = false

    // Refresh posts
    await fetchPosts()
  } catch (error) {
    console.error('Error adding post:', error)
    alert('Failed to add post. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const selectPost = async (post) => {
  selectedPost.value = post

  // Fetch comments for this post if not already loaded
  if (!postComments.value[post.id]) {
    await fetchComments(post.id)
  }
}

const addComment = async () => {
  if (!user.value) {
    alert('Please sign in to comment')
    return
  }

  if (!newComment.text) {
    return
  }

  isSubmittingComment.value = true

  try {
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        text: newComment.text,
        post_id: selectedPost.value.id,
        user_id: user.value.id,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Add comment to local state
    if (!postComments.value[selectedPost.value.id]) {
      postComments.value[selectedPost.value.id] = []
    }
    postComments.value[selectedPost.value.id].push(comment)

    // Reset form
    newComment.text = ''
  } catch (error) {
    console.error('Error adding comment:', error)
    alert('Failed to add comment. Please try again.')
  } finally {
    isSubmittingComment.value = false
  }
}

const toggleLike = async (post) => {
  if (!user.value) {
    alert('Please sign in to raise a concern')
    return
  }

  try {
    const isLiked = isLikedByCurrentUser(post)

    if (isLiked) {
      // Remove like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.value.id)

      if (error) throw error

      // Update local state
      postLikes.value[post.id] = postLikes.value[post.id].filter(
        (like) => like.user_id !== user.value.id,
      )
    } else {
      // Add like
      const { data, error } = await supabase
        .from('likes')
        .insert({
          post_id: post.id,
          user_id: user.value.id,
        })
        .select()
        .single()

      if (error) throw error

      // Update local state
      if (!postLikes.value[post.id]) {
        postLikes.value[post.id] = []
      }
      postLikes.value[post.id].push(data)
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    alert('Failed to update. Please try again.')
  }
}

const isLikedByCurrentUser = (post) => {
  if (!user.value || !postLikes.value[post.id]) return false
  return postLikes.value[post.id].some((like) => like.user_id === user.value.id)
}

// Fetch user profiles from the profiles table
const fetchUserProfiles = async (userIds) => {
  if (!userIds || userIds.length === 0) return

  try {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return
    }

    // Store profiles in our local state
    profilesData.forEach((profile) => {
      userProfiles.value[profile.id] = profile
    })
  } catch (error) {
    console.error('Error fetching user profiles:', error)
  }
}

// Fetch current user's profile
const fetchCurrentUserProfile = async () => {
  if (!user.value) return

  try {
    // Make sure we're using the user ID as a string/UUID, not trying to convert it
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (error) {
      console.error('Error fetching current user profile:', error)

      if (error.code === '22P02') {
        console.warn('Check if user_id column is the correct type (UUID).')
      }

      // Only attempt to create profile if it's a "no rows found" type of error
      if (error.code === 'PGRST116') {
        await createUserProfile()
      }

      return
    }

    currentUserProfile.value = data
    userProfiles.value[user.value.id] = data
  } catch (error) {
    console.error('Error fetching current user profile:', error)
  }
}

// Add this new function to create a user profile if it doesn't exist
const createUserProfile = async () => {
  if (!user.value) return

  try {
    // Extract user metadata
    const metadata = user.value.user_metadata || {}
    const email = user.value.email || ''

    // Create a new profile
    const { error } = await supabase.from('profiles').insert({
      id: user.value.id,
      username: metadata.name || metadata.full_name || email.split('@')[0],
      full_name: metadata.full_name || metadata.name || '',
      avatar_url: metadata.avatar_url || '',
    })

    if (error) {
      console.error('Error creating user profile:', error)
      return
    }

    // Fetch the newly created profile
    await fetchCurrentUserProfile()
  } catch (error) {
    console.error('Error creating user profile:', error)
  }
}

const fetchPosts = async () => {
  try {
    loading.value = true

    // Fetch posts
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (postsError) throw postsError

    posts.value = postsData

    // Extract all user IDs from posts
    const userIds = [...new Set(postsData.map((post) => post.user_id))]

    // Fetch user profiles
    await fetchUserProfiles(userIds)

    // Fetch likes for all posts
    await fetchAllLikes()

    // Fetch comments count for all posts
    await fetchAllCommentCounts()
  } catch (error) {
    console.error('Error fetching posts:', error)
    alert('Failed to load posts. Please refresh the page.')
  } finally {
    loading.value = false
  }
}

const fetchAllLikes = async () => {
  try {
    const { data: likesData, error: likesError } = await supabase.from('likes').select('*')

    if (likesError) throw likesError

    // Group likes by post_id
    const likesByPost = {}
    likesData.forEach((like) => {
      if (!likesByPost[like.post_id]) {
        likesByPost[like.post_id] = []
      }
      likesByPost[like.post_id].push(like)
    })

    postLikes.value = likesByPost
  } catch (error) {
    console.error('Error fetching likes:', error)
  }
}

const fetchAllCommentCounts = async () => {
  try {
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('post_id')

    if (commentsError) throw commentsError

    // Group comments by post_id and count
    const commentsByPost = {}
    commentsData.forEach((comment) => {
      if (!commentsByPost[comment.post_id]) {
        commentsByPost[comment.post_id] = []
      }
      commentsByPost[comment.post_id].push(comment)
    })

    postComments.value = commentsByPost
  } catch (error) {
    console.error('Error fetching comment counts:', error)
  }
}

const fetchComments = async (postId) => {
  try {
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (commentsError) throw commentsError

    // Extract user IDs from comments
    const userIds = [...new Set(commentsData.map((comment) => comment.user_id))]

    // Fetch user profiles for comment authors
    await fetchUserProfiles(userIds)

    postComments.value[postId] = commentsData
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
  }
}

const getUserInitials = () => {
  if (currentUserProfile.value) {
    const name = currentUserProfile.value.username || currentUserProfile.value.full_name || ''
    return name.charAt(0).toUpperCase()
  }

  if (!user.value) return 'U'

  const username =
    user.value.user_metadata?.name || user.value.user_metadata?.full_name || user.value.email || ''
  return username.charAt(0).toUpperCase()
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// In your signIn function:
const signIn = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) throw error
  } catch (error) {
    console.error('Error signing in:', error)
    alert('Failed to sign in. Please try again.')
  }
}

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    currentUserProfile.value = null
  } catch (error) {
    console.error('Error signing out:', error)
    alert('Failed to sign out. Please try again.')
  }
}

// Setup function - Fixed the onUnmounted issue by removing it from here
const setupRealtimeSubscriptions = () => {
  // Set up realtime subscription for posts
  const postsSubscription = supabase
    .channel('public:posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
      fetchPosts()
    })
    .subscribe()

  // Set up realtime subscription for likes
  const likesSubscription = supabase
    .channel('public:likes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => {
      fetchAllLikes()
    })
    .subscribe()

  // Set up realtime subscription for comments
  const commentsSubscription = supabase
    .channel('public:comments')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
      if (selectedPost.value) {
        fetchComments(selectedPost.value.id)
      }
      fetchAllCommentCounts()
    })
    .subscribe()

  // Set up realtime subscription for profiles
  const profilesSubscription = supabase
    .channel('public:profiles')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
      if (user.value) {
        fetchCurrentUserProfile()
      }
    })
    .subscribe()

  // Return cleanup function
  return () => {
    postsSubscription.unsubscribe()
    likesSubscription.unsubscribe()
    commentsSubscription.unsubscribe()
    profilesSubscription.unsubscribe()
  }
}

// In your onMounted function:
onMounted(async () => {
  // Check for existing session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  user.value = session?.user || null

  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null
    if (user.value) {
      fetchCurrentUserProfile()
    } else {
      currentUserProfile.value = null
    }
  })

  // Fetch current user profile if logged in
  if (user.value) {
    await fetchCurrentUserProfile()
  }

  // Set up realtime subscriptions
  const cleanup = setupRealtimeSubscriptions()

  // Register cleanup function properly
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanup)
  }

  // Fetch initial data
  await fetchPosts()
})
</script>

<style>
/* Add any custom styles here */
/* The component already uses Tailwind CSS classes for styling */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
