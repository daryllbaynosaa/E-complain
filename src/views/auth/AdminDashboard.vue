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
              <span class="ml-2 text-xl font-bold text-gray-900">E-Complain Admin</span>
            </div>
            <nav class="hidden md:ml-6 md:flex md:space-x-8">
              <a
                href="postfeed"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </a>
              <a
                href="admin"
                class="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Admin Dashboard
              </a>
            </nav>
          </div>
          <div class="flex items-center">
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
        <!-- Admin Dashboard Content -->
        <div v-if="!isAdmin" class="bg-white shadow rounded-lg p-6 text-center">
          <h2 class="text-xl font-medium text-red-600 mb-2">Access Denied</h2>
          <p class="text-gray-600">You do not have permission to access the admin dashboard.</p>
          <a href="postfeed" class="mt-4 inline-block text-blue-600 hover:underline"
            >Return to Home</a
          >
        </div>

        <div v-else>
          <!-- Dashboard Stats -->
          <div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg
                      class="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Total Posts</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ posts.length }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <svg
                      class="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Pending</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ pendingCount }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-blue-600 rounded-md p-3">
                    <svg
                      class="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Processing</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ processingCount }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg
                      class="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ resolvedCount }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="bg-white shadow rounded-lg p-4 mb-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center space-x-4">
                <div>
                  <label for="status-filter" class="block text-sm font-medium text-gray-700"
                    >Status</label
                  >
                  <select
                    id="status-filter"
                    v-model="statusFilter"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option v-for="status in statuses" :key="status.value" :value="status.value">
                      {{ status.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label for="privacy-filter" class="block text-sm font-medium text-gray-700"
                    >Privacy</label
                  >
                  <select
                    id="privacy-filter"
                    v-model="privacyFilter"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">All</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div>
                  <label for="category-filter" class="block text-sm font-medium text-gray-700"
                    >Category</label
                  >
                  <select
                    id="category-filter"
                    v-model="categoryFilter"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">All Categories</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label for="sort-by" class="block text-sm font-medium text-gray-700">Sort By</label>
                <select
                  id="sort-by"
                  v-model="sortBy"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="public-first">Public First</option>
                  <option value="private-first">Private First</option>
                </select>
              </div>

              <div>
                <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
                <input
                  type="text"
                  id="search"
                  v-model="searchQuery"
                  placeholder="Search by title or description"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Posts Table -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">All Concerns</h2>
              <span
                class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'Post' : 'Posts' }}
              </span>
            </div>

            <div class="border-t border-gray-200">
              <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>

              <div v-else-if="filteredPosts.length === 0" class="p-6 text-center text-gray-500">
                No posts found matching your filters.
              </div>

              <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Post
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Author
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Privacy
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="post in filteredPosts" :key="post.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {{ post.title }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div
                            v-if="getPostProfile(post)?.avatar_url"
                            class="h-8 w-8 rounded-full overflow-hidden"
                          >
                            <img
                              :src="getPostProfile(post).avatar_url"
                              alt="User avatar"
                              class="h-full w-full object-cover"
                            />
                          </div>
                          <div
                            v-else
                            class="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold"
                          >
                            {{ getPostAuthorInitial(post) }}
                          </div>
                          <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">
                              {{ getPostAuthorName(post) }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {{ getCategoryName(post.category_id) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-2">
                          <select
                            v-model="post.status"
                            class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            :disabled="updatingPostId === post.id"
                          >
                            <option
                              v-for="status in statuses"
                              :key="status.value"
                              :value="status.value"
                            >
                              {{ status.label }}
                            </option>
                          </select>
                          <button
                            v-if="post.status !== getOriginalPostStatus(post.id)"
                            @click="updatePostStatus(post.id, post.status)"
                            class="p-1 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                            :disabled="updatingPostId === post.id"
                          >
                            <span v-if="updatingPostId === post.id">
                              <svg
                                class="animate-spin h-4 w-4"
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
                            <span v-else>Save</span>
                          </button>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="
                            post.is_private
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-green-100 text-green-800'
                          "
                        >
                          {{ post.is_private ? 'Private' : 'Public' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(post.created_at) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          @click="viewPost(post)"
                          class="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Detail Modal -->
    <div
      v-if="selectedPost"
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
          @click="selectedPost = null"
        ></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Post Details
                  </h3>
                  <div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClasses(selectedPost.status)"
                    >
                      {{ getStatusLabel(selectedPost.status) }}
                    </span>
                    <span
                      v-if="selectedPost.is_private"
                      class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      Private
                    </span>
                  </div>
                </div>
                <div class="mt-4">
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

                  <!-- Admin Controls -->
                  <div class="mt-6 p-4 bg-gray-50 rounded-md">
                    <h3 class="text-sm font-medium text-gray-900 mb-2">Update Status</h3>
                    <div class="flex items-center space-x-2">
                      <select
                        v-model="selectedPostStatus"
                        class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        :disabled="updatingPostId === selectedPost?.id"
                      >
                        <option
                          v-for="status in statuses"
                          :key="status.value"
                          :value="status.value"
                        >
                          {{ status.label }}
                        </option>
                      </select>
                      <button
                        @click="updatePostStatus(selectedPost.id, selectedPostStatus)"
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        :disabled="
                          updatingPostId === selectedPost?.id ||
                          selectedPostStatus === getOriginalPostStatus(selectedPost?.id)
                        "
                      >
                        <span v-if="updatingPostId === selectedPost?.id" class="flex items-center">
                          <svg
                            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Updating...
                        </span>
                        <span v-else>Update</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="selectedPost = null"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase, updatePostStatusInDB } from '@/utils/supabase' // Import the helper function

// Add this new state to track which post is being updated
const updatingPostId = ref(null)
// Store original post data to detect changes
const originalPosts = ref({})

// User state
const user = ref(null)
const showUserMenu = ref(false)
const currentUserProfile = ref(null)
const isAdmin = ref(false)

// UI state
const loading = ref(true)
const selectedPost = ref(null)
const selectedPostStatus = ref(null)

// Filter state
const statusFilter = ref('')
const privacyFilter = ref('')
const categoryFilter = ref('')
const searchQuery = ref('')

// Sorting state
const sortBy = ref('newest')

// Data state
const posts = ref([])
const userProfiles = ref({})

// Status definitions
const statuses = [
  { value: 'pending', label: 'Pending', classes: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', classes: 'bg-blue-100 text-blue-800' },
  { value: 'resolved', label: 'Resolved', classes: 'bg-green-100 text-green-800' },
]

// Categories
const categories = [
  { id: 1, name: 'Infrastructure concern' },
  { id: 2, name: 'Environmental concern' },
  { id: 3, name: 'Security concern' },
  { id: 4, name: 'Noise Concern' },
  { id: 5, name: 'Health and sanitation' },
  { id: 6, name: 'Feature Requests' },
]

// Computed properties
const filteredPosts = computed(() => {
  let result = [...posts.value]

  // Filter by status
  if (statusFilter.value) {
    result = result.filter((post) => post.status === statusFilter.value)
  }

  // Filter by privacy
  if (privacyFilter.value === 'public') {
    result = result.filter((post) => !post.is_private)
  } else if (privacyFilter.value === 'private') {
    result = result.filter((post) => post.is_private)
  }

  // Filter by category
  if (categoryFilter.value) {
    result = result.filter((post) => post.category_id === Number.parseInt(categoryFilter.value))
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (post) =>
        post.title.toLowerCase().includes(query) || post.description.toLowerCase().includes(query),
    )
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'public-first':
      result.sort((a, b) => {
        // Sort by privacy (public first)
        if (a.is_private === b.is_private) {
          // If privacy is the same, sort by date (newest first)
          return new Date(b.created_at) - new Date(a.created_at)
        }
        return a.is_private ? 1 : -1 // Public posts (is_private=false) come first
      })
      break
    case 'private-first':
      result.sort((a, b) => {
        // Sort by privacy (private first)
        if (a.is_private === b.is_private) {
          // If privacy is the same, sort by date (newest first)
          return new Date(b.created_at) - new Date(a.created_at)
        }
        return a.is_private ? -1 : 1 // Private posts (is_private=true) come first
      })
      break
    default:
      // Default to newest first
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  return result
})

// Dashboard stats
const pendingCount = computed(() => {
  return posts.value.filter((post) => post.status === 'pending').length
})

const processingCount = computed(() => {
  return posts.value.filter((post) => post.status === 'processing').length
})

const resolvedCount = computed(() => {
  return posts.value.filter((post) => post.status === 'resolved').length
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

// Status helper methods
const getStatusLabel = (statusValue) => {
  const status = statuses.find((s) => s.value === statusValue)
  return status ? status.label : 'Pending'
}

const getStatusClasses = (statusValue) => {
  const status = statuses.find((s) => s.value === statusValue)
  return status ? status.classes : 'bg-yellow-100 text-yellow-800'
}

// Get profile for a post author
const getPostProfile = (post) => {
  if (!post || !post.user_id) return null
  return userProfiles.value[post.user_id] || null
}

// User display methods
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

// Modified function to track original post status
const getOriginalPostStatus = (postId) => {
  return originalPosts.value[postId]?.status || 'pending'
}

// Completely rewritten update post status function
const updatePostStatus = async (postId, newStatus) => {
  if (!isAdmin.value) {
    alert('Only admins can update post status')
    return
  }

  if (updatingPostId.value) {
    console.log('Another update is in progress, please wait')
    return
  }

  try {
    updatingPostId.value = postId
    console.log(`Updating post ${postId} status to ${newStatus}`)

    // Use the helper function from utils/supabase.js
    const updatedPost = await updatePostStatusInDB(postId, newStatus)

    if (!updatedPost) {
      throw new Error('Failed to update post status - no data returned')
    }

    console.log('Post updated successfully:', updatedPost)

    // Update the posts array with the new data
    posts.value = posts.value.map((post) => {
      if (post.id === postId) {
        // Update the original posts record too
        originalPosts.value[postId] = { ...updatedPost }
        return { ...updatedPost }
      }
      return post
    })

    // If this is the selected post, update it too
    if (selectedPost.value && selectedPost.value.id === postId) {
      selectedPost.value = { ...selectedPost.value, status: newStatus }
    }

    // Show success message
    alert(`Post status updated to ${getStatusLabel(newStatus)}`)

    // Force a refetch to ensure we have the latest data
    await fetchPosts()
  } catch (error) {
    console.error('Error updating post status:', error)
    alert(`Failed to update post status: ${error.message}`)
  } finally {
    updatingPostId.value = null
  }
}

// Implement the fetchPosts function to retrieve data from Supabase
const fetchPosts = async () => {
  try {
    loading.value = true
    console.log('Fetching posts...')

    // Fetch all posts
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      return
    }

    console.log('Posts fetched:', postsData)

    // Store the original posts data for comparison
    postsData.forEach((post) => {
      originalPosts.value[post.id] = { ...post }
    })

    // Update the posts ref
    posts.value = postsData

    // Extract unique user IDs from posts
    const userIds = [...new Set(postsData.map((post) => post.user_id).filter(Boolean))]

    // Fetch user profiles if we have user IDs
    if (userIds.length > 0) {
      await fetchUserProfiles(userIds)
    }
  } catch (error) {
    console.error('Error in fetchPosts:', error)
  } finally {
    loading.value = false
  }
}

// Enhanced view post function
const viewPost = (post) => {
  // Create a new object to ensure reactivity
  selectedPost.value = { ...post }
  selectedPostStatus.value = post.status
}

const checkAdminStatus = async () => {
  if (!user.value) {
    isAdmin.value = false
    return
  }

  try {
    // First check if the user exists in the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.value.id)
      .single()

    if (error) {
      console.error('Error checking admin status:', error)
      isAdmin.value = false
      return
    }

    // If is_admin is explicitly set to true in the profile, use that
    if (profile && profile.is_admin === true) {
      isAdmin.value = true
      console.log('User is admin based on profile.is_admin')
      return
    }

    // Otherwise, check the admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.value.id)
      .single()

    if (adminError && adminError.code !== 'PGSQL_RELATION_DOES_NOT_EXIST') {
      console.error('Error checking admins table:', adminError)
    }

    // If the user exists in the admins table, they're an admin
    isAdmin.value = !!adminData
    console.log('Is admin based on admins table:', isAdmin.value)
  } catch (error) {
    console.error('Error in checkAdminStatus:', error)
    isAdmin.value = false
  }
}

// Implement the fetchUserProfiles function
const fetchUserProfiles = async (userIds) => {
  try {
    if (!userIds || userIds.length === 0) {
      console.log('No user IDs to fetch')
      return
    }

    const { data, error } = await supabase.from('profiles').select('*').in('id', userIds)

    if (error) {
      console.error('Error fetching user profiles:', error)
      return
    }

    const newProfiles = {}
    data.forEach((profile) => {
      newProfiles[profile.id] = profile
    })

    userProfiles.value = newProfiles
    console.log('User profiles fetched:', userProfiles.value)
  } catch (error) {
    console.error('Error fetching user profiles:', error)
  }
}

// Implement the setupRealtimeSubscriptions function
const setupRealtimeSubscriptions = () => {
  // Remove any existing subscription
  if (postsSubscription) {
    supabase.removeChannel(postsSubscription)
  }

  // Subscribe to changes on the posts table
  postsSubscription = supabase
    .channel('posts-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
      console.log('Realtime update received:', payload)
      // Refresh the posts data when changes occur
      fetchPosts()
    })
    .subscribe((status) => {
      console.log('Realtime subscription status:', status)
    })
}

const fetchCurrentUserProfile = async () => {
  try {
    if (!user.value) {
      console.log('No user to fetch profile for')
      return
    }

    console.log('Fetching profile for user:', user.value.id)

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (error) {
      console.error('Error fetching current user profile:', error)
      return
    }

    currentUserProfile.value = profile
    console.log('Current user profile fetched:', currentUserProfile.value)

    // Check admin status after profile is loaded
    await checkAdminStatus()
  } catch (error) {
    console.error('Error fetching current user profile:', error)
  }
}

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    console.log('User signed out')
    user.value = null
    currentUserProfile.value = null
    isAdmin.value = false
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

const getUserInitials = () => {
  if (currentUserProfile.value && currentUserProfile.value.username) {
    return currentUserProfile.value.username.charAt(0).toUpperCase()
  }
  return 'U'
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Variable to store the realtime subscription
let postsSubscription = null

onMounted(async () => {
  console.log('Admin Dashboard mounted')

  // Check for existing session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  user.value = session?.user || null

  console.log('User from session:', user.value?.id)

  // Set up auth state change listener
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event)
    user.value = session?.user || null
    if (user.value) {
      fetchCurrentUserProfile()
    } else {
      currentUserProfile.value = null
      isAdmin.value = false
    }
  })

  // Fetch current user profile if logged in
  if (user.value) {
    console.log('User is logged in, fetching profile')
    await fetchCurrentUserProfile()
  }

  // Set up realtime subscriptions
  setupRealtimeSubscriptions()

  // Fetch initial data
  console.log('Fetching initial data')
  await fetchPosts()
})

onUnmounted(() => {
  if (postsSubscription) {
    supabase.removeChannel(postsSubscription)
    console.log('Realtime subscription removed')
  }
})
</script>
