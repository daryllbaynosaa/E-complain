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
              <span class="ml-2 text-xl font-bold text-blue-900">E-Complain</span>
            </div>
            <nav class="hidden md:ml-6 md:flex md:space-x-8">
              <!-- Admin Dashboard Link (only visible to admins) -->
              <a
                v-if="isAdmin"
                href="admin"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Admin Dashboard
              </a>
            </nav>
          </div>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <!-- New Post Button - Modified for responsive sizing -->
              <button
                v-if="user"
                @click="showNewPostForm = true"
                class="relative inline-flex items-center border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                :class="{
                  'px-2 py-1': window.innerWidth < 640,
                  'px-4 py-2': window.innerWidth >= 640,
                }"
                style="
                  color: white !important;
                  background-color: #e11d48 !important;
                  display: flex !important;
                  align-items: center !important;
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 md:mr-2"
                  :class="{ '-ml-1': window.innerWidth >= 640 }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style="color: white !important"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span
                  style="color: white !important; display: inline !important"
                  class="hidden sm:inline"
                  >New Post</span
                >
              </button>
              <button
                v-else
                @click="signIn"
                class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                <router-link to="signup"><span>Sign In</span></router-link>
              </button>
            </div>
            <div class="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <div v-if="user" class="ml-3 relative">
                <div>
                  <button
                    class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
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
                      class="h-8 w-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 font-semibold"
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

                  <a href="/login2" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Sign out</a
                  >
                </div>
              </div>
            </div>
            <!-- Mobile menu button -->
            <div class="flex items-center md:hidden ml-2">
              <button
                @click="mobileMenuOpen = !mobileMenuOpen"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500"
              >
                <span class="sr-only">Open main menu</span>
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <a
            v-if="isAdmin"
            href="admin"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >Admin Dashboard</a
          >
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div v-if="user" class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div
                v-if="currentUserProfile && currentUserProfile.avatar_url"
                class="h-10 w-10 rounded-full overflow-hidden"
              >
                <img
                  :src="currentUserProfile.avatar_url"
                  alt="User avatar"
                  class="h-full w-full object-cover"
                />
              </div>
              <div
                v-else
                class="h-10 w-10 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 font-semibold"
              >
                {{ getUserInitials() }}
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">
                {{ getUsername() }}
              </div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <a
              href="/profile"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >Your Profile</a
            >
            <a
              href="/login2"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >Sign out</a
            >
          </div>
        </div>
      </div>
    </header>

    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Mobile Filter Toggle -->
          <div class="lg:hidden mb-4">
            <button
              @click="showMobileFilters = !showMobileFilters"
              class="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <span>Filters & Categories</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition-transform"
                :class="{ 'transform rotate-180': showMobileFilters }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Sidebar - Desktop always visible, Mobile conditionally visible -->
          <div
            :class="{
              'lg:col-span-1': true,
              'hidden lg:block': !showMobileFilters,
              block: showMobileFilters,
            }"
          >
            <div class="bg-white shadow rounded-lg p-4 sticky top-20">
              <!-- Categories Section -->
              <div class="mb-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Categories</h2>
                <div class="space-y-2">
                  <!-- All Categories Button -->

                  <div class="relative">
                    <button
                      @click="toggleCategory(null)"
                      class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex justify-between items-center"
                      :class="[
                        selectedCategory === null
                          ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-md transform scale-105 border border-purple-300'
                          : 'text-gray-700 hover:bg-gray-50 border border-transparent',
                      ]"
                    >
                      <span :class="{ 'text-white': selectedCategory === null }"
                        >All Categories</span
                      >
                      <svg
                        v-if="selectedCategory === null"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Category Buttons -->

                  <div v-for="category in categories" :key="category.id" class="relative">
                    <button
                      @click="toggleCategory(category.id)"
                      class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex justify-between items-center"
                      :class="[
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-md transform scale-105 border border-purple-300'
                          : 'text-gray-700 hover:bg-gray-50 border border-transparent',
                      ]"
                    >
                      <span :class="{ 'text-white': selectedCategory === category.id }">{{
                        category.name
                      }}</span>
                      <svg
                        v-if="selectedCategory === category.id"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Sort By Section -->
              <div class="mb-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Sort By</h2>
                <div class="space-y-2">
                  <!-- Sort Buttons -->

                  <div class="relative">
                    <button
                      @click="toggleSort('newest')"
                      class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex justify-between items-center"
                      :class="[
                        sortBy === 'newest'
                          ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-md transform scale-105 border border-purple-300'
                          : 'text-gray-700 hover:bg-gray-50 border border-transparent',
                      ]"
                    >
                      <span :class="{ 'text-white': sortBy === 'newest' }">Newest</span>
                      <svg
                        v-if="sortBy === 'newest'"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="relative">
                    <button
                      @click="toggleSort('trending')"
                      class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex justify-between items-center"
                      :class="[
                        sortBy === 'trending'
                          ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-md transform scale-105 border border-purple-300'
                          : 'text-gray-700 hover:bg-gray-50 border border-transparent',
                      ]"
                    >
                      <span :class="{ 'text-white': sortBy === 'trending' }">Most Raised</span>
                      <svg
                        v-if="sortBy === 'trending'"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="relative">
                    <button
                      @click="toggleSort('mostComments')"
                      class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex justify-between items-center"
                      :class="[
                        sortBy === 'mostComments'
                          ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-md transform scale-105 border border-purple-300'
                          : 'text-gray-700 hover:bg-gray-50 border border-transparent',
                      ]"
                    >
                      <span :class="{ 'text-white': sortBy === 'mostComments' }"
                        >Most Discussed</span
                      >
                      <svg
                        v-if="sortBy === 'mostComments'"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
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
                  class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full w-full max-w-md mx-auto"
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
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
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
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
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
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                              placeholder="Describe your concern in detail include address, location, etc."
                              required
                            ></textarea>
                          </div>
                          <!-- Privacy Option -->
                          <div>
                            <label class="block text-sm font-medium text-gray-700">Privacy</label>
                            <div
                              class="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0"
                            >
                              <div class="flex items-center">
                                <input
                                  id="privacy-public"
                                  type="radio"
                                  v-model="newPost.isPrivate"
                                  :value="false"
                                  class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                                />
                                <label for="privacy-public" class="ml-2 text-sm text-gray-700">
                                  Public (Visible to everyone)
                                </label>
                              </div>
                              <div class="flex items-center">
                                <input
                                  id="privacy-private"
                                  type="radio"
                                  v-model="newPost.isPrivate"
                                  :value="true"
                                  class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                                />
                                <label for="privacy-private" class="ml-2 text-sm text-gray-700">
                                  Private (Only visible to you and admins)
                                </label>
                              </div>
                            </div>
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
                              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
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
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm"
                      style="
                        color: white !important;
                        background-color: #e11d48 !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                      "
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
                      <span style="color: white !important; display: inline !important">Post</span>
                    </button>
                    <button
                      type="button"
                      @click="showNewPostForm = false"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selected Post Detail View -->
            <div v-if="selectedPost" class="bg-white shadow sm:rounded-lg overflow-hidden">
              <div class="px-4 py-5 sm:px-6 flex flex-wrap justify-between items-center">
                <button
                  @click="selectedPost = null"
                  class="inline-flex items-center text-sm font-medium text-rose-600 hover:text-rose-500 mb-2 sm:mb-0"
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

                <!-- Status Badge -->
                <div class="flex items-center space-x-2">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClasses(selectedPost.status)"
                  >
                    {{ getStatusLabel(selectedPost.status) }}
                  </span>

                  <!-- Privacy Badge -->
                  <span
                    v-if="selectedPost.is_private"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    Private
                  </span>
                </div>
              </div>

              <div class="border-t border-gray-200">
                <div class="px-4 py-5 sm:px-6">
                  <div class="flex items-center flex-wrap">
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
                      class="h-10 w-10 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 font-semibold"
                    >
                      {{ getPostAuthorInitial(selectedPost) }}
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">
                        {{ getPostAuthorName(selectedPost) }}
                      </p>
                      <p class="text-sm text-gray-500">{{ formatDate(selectedPost.created_at) }}</p>
                    </div>
                    <div class="ml-auto mt-2 sm:mt-0">
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
                      class="max-h-96 w-full object-contain rounded-md"
                    />
                  </div>

                  <!-- Admin Controls -->
                  <div v-if="isAdmin" class="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 class="text-sm font-medium text-gray-900 mb-2">Admin Controls</h3>
                    <div class="flex items-center flex-wrap gap-2">
                      <label for="status-update" class="text-sm text-gray-700"
                        >Update Status:</label
                      >
                      <select
                        id="status-update"
                        v-model="selectedPostStatus"
                        class="rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 text-sm"
                        @change="updatePostStatus(selectedPost.id, selectedPostStatus)"
                      >
                        <option
                          v-for="status in statuses"
                          :key="status.value"
                          :value="status.value"
                        >
                          {{ status.label }}
                        </option>
                      </select>
                    </div>
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
                          d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 0111 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
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
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                      placeholder="Write your comment here"
                      required
                    ></textarea>
                  </div>
                  <div class="flex justify-end">
                    <button
                      type="submit"
                      :disabled="isSubmittingComment"
                      class="inline-flex justify-center rounded-md border border-transparent bg-rose-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
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
                  <button @click="signIn" class="text-rose-600 font-medium">sign in</button> to
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
                          <div class="flex justify-between flex-wrap">
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
                    <div class="flex items-center flex-wrap">
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
                        class="h-10 w-10 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 font-semibold"
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
                      <div class="ml-auto mt-2 sm:mt-0 flex items-center space-x-2">
                        <!-- Status Badge -->
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getStatusClasses(trendingPosts[0].status)"
                        >
                          {{ getStatusLabel(trendingPosts[0].status) }}
                        </span>
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
                    <div class="mt-4 flex items-center space-x-4 flex-wrap">
                      <button
                        @click.stop="toggleLike(trendingPosts[0])"
                        class="inline-flex items-center text-sm font-medium mb-2 sm:mb-0"
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
                            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 0111 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
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
                <div class="px-4 py-5 sm:px-6 flex justify-between items-center flex-wrap">
                  <h2 class="text-lg font-medium text-gray-900 mb-2 sm:mb-0">
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
                    <div class="flex items-center flex-wrap">
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
                        class="h-10 w-10 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 font-semibold"
                      >
                        {{ getPostAuthorInitial(post) }}
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">
                          {{ getPostAuthorName(post) }}
                        </p>
                        <p class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</p>
                      </div>
                      <div class="ml-auto mt-2 sm:mt-0 flex items-center space-x-2 flex-wrap">
                        <!-- Status Badge -->
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-1 mb-1 sm:mb-0"
                          :class="getStatusClasses(post.status)"
                        >
                          {{ getStatusLabel(post.status) }}
                        </span>

                        <!-- Privacy Badge -->
                        <span
                          v-if="post.is_private"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-1 mb-1 sm:mb-0"
                        >
                          Private
                        </span>

                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1 sm:mb-0"
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
                    <div class="mt-4 flex items-center space-x-4 flex-wrap">
                      <button
                        @click.stop="toggleLike(post)"
                        class="inline-flex items-center text-sm font-medium mb-2 sm:mb-0"
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
                            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 0111 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
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

// Add window object for responsive design
const window = ref(typeof globalThis !== 'undefined' ? globalThis : { innerWidth: 1024 })

// User state
const user = ref(null)
const showUserMenu = ref(false)
const currentUserProfile = ref(null)
const isAdmin = ref(false) // Admin status flag

// UI state
const loading = ref(true)
const selectedCategory = ref(null)
const selectedPost = ref(null)
const selectedPostStatus = ref(null) // For admin status updates
const selectedStatus = ref(null) // For status filtering
const showNewPostForm = ref(false)
const sortBy = ref('newest')
const isSubmitting = ref(false)
const isSubmittingComment = ref(false)
const imagePreview = ref(null)
const mobileMenuOpen = ref(false) // Mobile menu toggle
const showMobileFilters = ref(false) // Mobile filters toggle

// Data state
const posts = ref([])
const postLikes = ref({})
const postComments = ref({})
const userProfiles = ref({}) // Store user profiles by ID

// Status definitions
const statuses = [
  { value: 'pending', label: 'Pending', classes: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', classes: 'bg-rose-100 text-rose-800' },
  { value: 'resolved', label: 'Resolved', classes: 'bg-green-100 text-green-800' },
]

// Categories
const categories = [
  { id: 1, name: 'Infrastructure concern' },
  { id: 2, name: 'Environmental concern' },
  { id: 3, name: 'Security concern' },
  { id: 4, name: 'Noise Concern' },
  { id: 5, name: 'Health and sanitation' },
  { id: 6, name: 'Other concern' },
]

// Form state
const newPost = reactive({
  title: '',
  description: '',
  imageFile: null,
  categoryId: '',
  isPrivate: false, // Privacy option
})

const newComment = reactive({
  text: '',
})

// Add window resize event listener to update responsive classes
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.value = globalThis.window
    globalThis.window.addEventListener('resize', () => {
      window.value = globalThis.window
    })
  }

  // Rest of your onMounted code...
  try {
    console.log('Component mounting...')

    // Test Supabase connection first
    testSupabaseConnection()

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      user.value = session?.user || null
      console.log('Initial auth status:', user.value ? 'Authenticated' : 'Not authenticated')

      // Fetch current user profile if logged in
      if (user.value) {
        fetchCurrentUserProfile()
      }
    })

    // Set up auth state change listener
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event)
      user.value = session?.user || null
      if (user.value) {
        fetchCurrentUserProfile()
      } else {
        currentUserProfile.value = null
        isAdmin.value = false
      }
    })

    // Set up realtime subscriptions
    const cleanup = setupRealtimeSubscriptions()

    // Register cleanup function properly
    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.addEventListener('beforeunload', cleanup)
    }

    // Fetch initial data
    console.log('About to fetch posts in onMounted...')
    fetchPosts()
    console.log('Posts fetched in onMounted')
  } catch (error) {
    console.error('Error in onMounted:', error)
    loading.value = false
  }
})

// Computed properties
const filteredPosts = computed(() => {
  let result = [...posts.value]

  // Filter by category if selected
  if (selectedCategory.value) {
    result = result.filter((post) => post.category_id === selectedCategory.value)
  }

  // Filter by status if selected
  if (selectedStatus.value) {
    result = result.filter((post) => post.status === selectedStatus.value)
  }

  // Filter out private posts unless user is the author or an admin
  result = result.filter((post) => {
    if (!post.is_private) return true
    if (!user.value) return false
    return post.user_id === user.value.id || isAdmin.value
  })

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
  // Filter out private posts for trending unless user is the author or an admin
  let visiblePosts = posts.value.filter((post) => {
    if (!post.is_private) return true
    if (!user.value) return false
    return post.user_id === user.value.id || isAdmin.value
  })

  return visiblePosts.sort(
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

// Status helper methods
const getStatusLabel = (statusValue) => {
  const status = statuses.find((s) => s.value === statusValue)
  return status ? status.label : 'Pending'
}

const getStatusClasses = (statusValue) => {
  const status = statuses.find((s) => s.value === statusValue)
  return status ? status.classes : 'bg-yellow-100 text-yellow-800'
}

// Toggle methods for category, sort, and status
const toggleCategory = (categoryId) => {
  // Original functionality
  if (selectedCategory.value === categoryId) {
    selectedCategory.value = null
  } else {
    selectedCategory.value = categoryId
  }
  // Close mobile filters after selection on mobile
  if (window.value.innerWidth < 1024) {
    showMobileFilters.value = false
  }
}

const toggleSort = (sortOption) => {
  // Original functionality
  if (sortBy.value === sortOption) {
    sortBy.value = 'newest' // Default to newest if unselected
  } else {
    sortBy.value = sortOption
  }
  // Close mobile filters after selection on mobile
  if (window.value.innerWidth < 1024) {
    showMobileFilters.value = false
  }
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

// Methods to handle user display
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

const getUsername = () => {
  if (currentUserProfile.value) {
    return currentUserProfile.value.username || currentUserProfile.value.full_name || 'User'
  }

  if (!user.value) return 'User'

  return (
    user.value.user_metadata?.name ||
    user.value.user_metadata?.full_name ||
    user.value.email?.split('@')[0] ||
    'User'
  )
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

// Update post status
const updatePostStatus = async (postId, newStatus) => {
  if (!isAdmin.value) {
    alert('Only admins can update post status')
    return
  }

  try {
    const { error } = await supabase.from('posts').update({ status: newStatus }).eq('id', postId)

    if (error) throw error

    // Update local state
    const postIndex = posts.value.findIndex((p) => p.id === postId)
    if (postIndex !== -1) {
      posts.value[postIndex].status = newStatus
    }

    // If this is the selected post, update its status
    if (selectedPost.value && selectedPost.value.id === postId) {
      selectedPost.value.status = newStatus
    }
  } catch (error) {
    console.error('Error updating post status:', error)
    alert('Failed to update post status. Please try again.')
  }
}

// Add post function
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

    // Insert post with new fields
    const { error } = await supabase.from('posts').insert({
      title: newPost.title,
      description: newPost.description,
      image_url: imageUrl,
      category_id: parseInt(newPost.categoryId),
      user_id: user.value.id,
      status: 'pending', // Default status
      is_private: newPost.isPrivate, // Privacy field
    })

    if (error) {
      throw error
    }

    // Reset form and close modal
    newPost.title = ''
    newPost.description = ''
    newPost.imageFile = null
    newPost.categoryId = ''
    newPost.isPrivate = false
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
  selectedPostStatus.value = post.status // Set the current status for admin controls

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

// Check if user is admin
const checkAdminStatus = async () => {
  if (!user.value) {
    isAdmin.value = false
    return
  }

  try {
    console.log('Checking admin status for user:', user.value.id)

    // First try direct query to admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.value.id)

    console.log('Direct admin query result:', adminData, adminError)

    // Then try the is_admin function
    const { data, error } = await supabase.rpc('is_admin', {
      user_uuid: user.value.id,
    })

    console.log('is_admin function result:', data, error)

    if (error) {
      console.error('Error checking admin status:', error)
      isAdmin.value = false
      return
    }

    // Set admin status based on function result
    isAdmin.value = !!data
    console.log('Final admin status:', isAdmin.value)
  } catch (error) {
    console.error('Error checking admin status:', error)
    isAdmin.value = false
  }
}

// Test Supabase connection
const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set')
    console.log(
      'Supabase Key:',
      supabaseKey ? 'Set (length: ' + supabaseKey.length + ')' : 'Not set',
    )

    // Try a simple query
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }

    console.log('Supabase connection successful, posts count:', count)
    return true
  } catch (err) {
    console.error('Supabase connection error:', err)
    return false
  }
}

// Fetch user profiles from the profiles table
const fetchUserProfiles = async (userIds) => {
  if (!userIds || userIds.length === 0) {
    console.log('No user IDs to fetch profiles for')
    return
  }

  try {
    console.log('Fetching profiles for user IDs:', userIds)

    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return
    }

    console.log('Profiles fetched:', profilesData?.length || 0)

    // Store profiles in our local state
    if (profilesData && profilesData.length > 0) {
      profilesData.forEach((profile) => {
        if (profile && profile.id) {
          userProfiles.value[profile.id] = profile
        }
      })
    }
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

    // Check admin status after profile is loaded
    await checkAdminStatus()
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

// Fetch posts function
const fetchPosts = async () => {
  try {
    console.log('Fetching posts...')
    loading.value = true

    // Log authentication status
    const { data: session } = await supabase.auth.getSession()
    console.log(
      'Auth status:',
      session ? `Authenticated as ${session.user?.id}` : 'Not authenticated',
    )

    // Fetch posts with more detailed error handling
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('Error fetching posts - DETAILS:', postsError)
      console.error('Error code:', postsError.code)
      console.error('Error message:', postsError.message)
      console.error('Error details:', postsError.details)
      throw postsError
    }

    // Check if postsData exists
    if (!postsData) {
      console.log('No posts data returned')
      posts.value = []
      return
    }

    console.log('Posts fetched:', postsData.length)

    // Add default status if missing
    postsData.forEach((post) => {
      if (!post.status) post.status = 'pending'
    })

    posts.value = postsData

    // Extract all user IDs from posts - WITH NULL CHECKS
    const userIds = []
    if (postsData && postsData.length > 0) {
      for (const post of postsData) {
        if (post && post.user_id) {
          userIds.push(post.user_id)
        }
      }
    }

    const uniqueUserIds = [...new Set(userIds)]
    console.log('User IDs extracted:', uniqueUserIds)

    // Only fetch profiles if there are user IDs
    if (uniqueUserIds.length > 0) {
      // Fetch user profiles
      await fetchUserProfiles(uniqueUserIds)
    }

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
    console.log('Fetching likes...')
    const { data: likesData, error: likesError } = await supabase.from('likes').select('*')

    if (likesError) {
      console.error('Error fetching likes:', likesError)
      return
    }

    console.log('Likes fetched:', likesData?.length || 0)

    // Group likes by post_id
    const likesByPost = {}
    if (likesData && likesData.length > 0) {
      likesData.forEach((like) => {
        if (like && like.post_id) {
          if (!likesByPost[like.post_id]) {
            likesByPost[like.post_id] = []
          }
          likesByPost[like.post_id].push(like)
        }
      })
    }

    postLikes.value = likesByPost
  } catch (error) {
    console.error('Error fetching likes:', error)
  }
}

const fetchAllCommentCounts = async () => {
  try {
    console.log('Fetching comment counts...')
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('post_id')

    if (commentsError) {
      console.error('Error fetching comment counts:', commentsError)
      return
    }

    console.log('Comments fetched:', commentsData?.length || 0)

    // Group comments by post_id and count
    const commentsByPost = {}
    if (commentsData && commentsData.length > 0) {
      commentsData.forEach((comment) => {
        if (comment && comment.post_id) {
          if (!commentsByPost[comment.post_id]) {
            commentsByPost[comment.post_id] = []
          }
          commentsByPost[comment.post_id].push(comment)
        }
      })
    }

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

    if (commentsError) {
      console.error('Error fetching comments:', commentsError)
      return
    }

    // Extract user IDs from comments with null checks
    const userIds = []
    if (commentsData && commentsData.length > 0) {
      for (const comment of commentsData) {
        if (comment && comment.user_id) {
          userIds.push(comment.user_id)
        }
      }
    }

    const uniqueUserIds = [...new Set(userIds)]

    // Fetch user profiles for comment authors
    if (uniqueUserIds.length > 0) {
      await fetchUserProfiles(uniqueUserIds)
    }

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

// Sign in function placeholder
const signIn = () => {
  // Redirect to sign in page or open sign in modal
  window.location.href = '/signup'
}

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    currentUserProfile.value = null
    isAdmin.value = false
  } catch (error) {
    console.error('Error signing out:', error)
    alert('Failed to sign out. Please try again.')
  }
}

// Setup function for realtime subscriptions
const setupRealtimeSubscriptions = () => {
  // Set up realtime subscription for posts
  const postsSubscription = supabase
    .channel('public:posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
      console.log('Post change detected:', payload)

      // If it's an update to an existing post
      if (payload.eventType === 'UPDATE') {
        // Option 1: Fetch the specific post that was updated
        if (payload.new && payload.new.id) {
          fetchSinglePost(payload.new.id)
        }
        // Option 2: Or refresh all posts (simpler but less efficient)
        else {
          fetchPosts()
        }
      } else {
        // For inserts and deletes, refresh the full list
        fetchPosts()
      }
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

// Add this new function to fetch a single post when it's updated:
const fetchSinglePost = async (postId) => {
  try {
    const { data, error } = await supabase.from('posts').select('*').eq('id', postId).single()

    if (error) {
      console.error(`Error fetching post ${postId}:`, error)
      return
    }

    if (!data) {
      console.log(`No data returned for post ${postId}`)
      return
    }

    // Update the post in the local state
    const postIndex = posts.value.findIndex((p) => p.id === postId)
    if (postIndex !== -1) {
      // Update the post in the array
      posts.value[postIndex] = data

      // If this is the currently selected post, update it too
      if (selectedPost.value && selectedPost.value.id === postId) {
        selectedPost.value = data
        selectedPostStatus.value = data.status
      }
    } else {
      // If the post isn't in our current list, add it
      posts.value.push(data)
    }
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error)
  }
}
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

/* Force button text to be visible */
button span {
  display: inline !important;
  color: inherit !important;
}

/* Force SVG icons to be visible */
button svg {
  display: inline-block !important;
  color: inherit !important;
}

/* Ensure buttons have proper dimensions */
button {
  min-height: 38px;
}

/* Adjust button size on small screens */
@media (max-width: 640px) {
  button.relative.inline-flex.items-center {
    min-width: auto;
  }
}

/* Ensure rose colored buttons have proper color */
.bg-rose-600 {
  background-color: #e11d48 !important;
  color: white !important;
}

/* Add transition effects for button interactions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.duration-200 {
  transition-duration: 200ms;
}

/* Enhanced button transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Add a subtle hover effect for all buttons */
button.w-full:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Fix for selected buttons text color - ensure consistent white text */
.bg-gradient-to-r.from-rose-400.to-pink-500 span.text-white,
.bg-gradient-to-r.from-purple-400.to-indigo-500 span.text-white,
.bg-gradient-to-r.from-blue-400.to-cyan-500 span.text-white {
  color: white !important;
}

/* Ensure checkmark icons are white */
button.bg-gradient-to-r svg.text-white {
  color: white !important;
}

/* Fix for selected category and sort buttons */
button.bg-gradient-to-r.from-rose-400.to-pink-500 span,
button.bg-gradient-to-r.from-purple-400.to-indigo-500 span,
button.bg-gradient-to-r.from-blue-400.to-cyan-500 span {
  color: white !important;
}

/* Add new styles for the blue "Raises" button */
.text-blue-600 {
  color: #2563eb !important;
}

/* Override the SVG fill color for liked posts */
button.text-blue-600 svg {
  color: #2563eb !important;
}
</style>
