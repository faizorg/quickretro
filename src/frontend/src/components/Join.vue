<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DarkModeToggle from './DarkModeToggle.vue';
import Avatar from './Avatar.vue';
import { useI18n } from 'vue-i18n';
import LanguageSelector from './LanguageSelector.vue';
import { generateUUID } from '../utils/uuid';

const MAX_TEXT_LENGTH: number = Number(import.meta.env.VITE_MAX_TEXT_LENGTH)
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const board = Array.isArray(route.params.board)
    ? route.params.board[0]
    : route.params.board
const guestname = ref(localStorage.getItem('nickname') || '')

const isGuestNameValid = computed(() => {
    if (guestname.value && guestname.value.trim() !== '') return true
    return false
})

const join = () => {
    if (isGuestNameValid.value) {
        localStorage.setItem("nickname", guestname.value)
        if (board && board.trim() != '') {
            router.push(`/board/${board}`)
        } else {
            router.push(`/create`) // Todo: How about router.replace() ?
        }
    }
}

onMounted(() => {
    if (!localStorage.getItem("user")) {
        localStorage.setItem("user", generateUUID())
    }
    if (!localStorage.getItem("xid")) {
        localStorage.setItem("xid", generateUUID())
    }

    const isDark = ref(localStorage.getItem("theme") === "dark")
    document.documentElement.classList.toggle("dark", isDark.value)
})

</script>

<template>
    <div class="bg-gradient-to-br from-purple-50 via-teal-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex h-screen items-center justify-center p-4 relative overflow-hidden">
        <!-- Animated gradient mesh background -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400 to-purple-600 opacity-30 dark:opacity-20 rounded-full blur-3xl animate-float"></div>
            <div class="absolute bottom-1/3 -right-20 w-[30rem] h-[30rem] bg-gradient-to-br from-teal-400 to-teal-600 opacity-30 dark:opacity-20 rounded-full blur-3xl animate-float" style="animation-delay: 1s;"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-fuchsia-400 to-pink-500 opacity-20 dark:opacity-15 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <div class="w-full max-w-md relative z-10">
            <div class="glass-card dark:glass-card-dark shadow-brand-lg rounded-2xl p-8 border border-purple-200 dark:border-purple-900 animate-scale-in">
                <div class="flex justify-center items-center h-11 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-11 h-11 text-gray-600 dark:text-gray-400"
                        v-if="!isGuestNameValid">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <Avatar :name="guestname" class="w-10 h-10" v-if="isGuestNameValid" />
                </div>
                <h2
                    class="mt-3 text-center text-3xl font-bold tracking-tight text-gray-600 dark:text-gray-400 select-none">
                    {{ t('join.label') }}
                </h2>
                <div class="space-y-4 mt-4">
                    <div>
                        <div class="mt-1">
                            <input v-model.trim="guestname" name="guestname" type="text" :maxlength="MAX_TEXT_LENGTH"
                                :placeholder="t('join.namePlaceholder')" required
                                class="px-2 py-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm dark:bg-slate-800 dark:text-slate-200" />
                        </div>
                        <div class="h-5 flex items-center">
                            <p v-show="!isGuestNameValid" name="guestname-required"
                                class="text-sm text-red-600 dark:text-red-300 mt-2 select-none">{{
                                    t('join.nameRequired') }}</p>
                        </div>
                    </div>
                    <div class="flex w-full gap-3">
                        <button type="submit"
                            class="btn-ripple flex items-center justify-center px-4 py-3 text-base font-semibold flex-1 shadow-brand bg-gradient-brand hover:bg-gradient-brand-hover text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-400 disabled:cursor-not-allowed disabled:shadow-none rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 dark:focus:ring-2 dark:focus:ring-offset-0 select-none transform hover:scale-105 transition-all duration-300"
                            :disabled="!isGuestNameValid" @click="join">
                            {{ t('join.button') }}
                        </button>
                        <div
                            class="flex items-center justify-center p-3 shadow-md border rounded-lg border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 hover:shadow-brand transition-all duration-300">
                            <DarkModeToggle class="w-6 h-6 cursor-pointer text-purple-400 hover:text-teal-400" />
                        </div>
                    </div>
                    <div class="w-full">
                        <LanguageSelector />
                    </div>
                </div>
            </div>
            <!-- Footer Branding -->
            <div class="mt-6 text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Powered by <a href="https://www.faizakram.com/" target="_blank" rel="noopener noreferrer" class="font-semibold gradient-text hover:opacity-80 transition-opacity">Faiz Akram</a>
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Professional Sprint Retrospectives
                </p>
            </div>
        </div>
    </div>
</template>