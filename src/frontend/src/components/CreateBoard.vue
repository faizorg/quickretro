<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CreateBoardRequest, createBoard } from '../api'
import DarkModeToggle from './DarkModeToggle.vue';
import { BoardColumn } from '../models/BoardColumn';
import { CategoryDefinition } from "../models/CategoryDefinition";
import { useI18n } from 'vue-i18n';
import LanguageSelector from './LanguageSelector.vue';
import TurnstileWidget from './TurnstileWidget.vue';
import { useToast } from 'vue-toast-notification';
import CategoryEditor from './CategoryEditor.vue';
import { defaultCategories } from '../constants/defaultCategories';

const MAX_TEXT_LENGTH: number = Number(import.meta.env.VITE_MAX_TEXT_LENGTH)
const { t } = useI18n()
const router = useRouter()
const boardname = ref('')
const team = ref('')
const isDark = ref(localStorage.getItem("theme") === "dark")
const isTurnstileEnabled = ref(window.APP_CONFIG?.turnstileEnabled || false)
const turnstileSiteKey = ref(window.APP_CONFIG?.turnstileSiteKey || '')
const turnstileToken = ref('')
const isTurnstileVerified = ref(false)
const isSubmitting = ref(false)
const turnstileRef = ref<{ reset: () => void }>()
const categories = ref<CategoryDefinition[]>([...defaultCategories])
const isCategorySelectionValid = ref(true)

const handleCategoryTextUpdate = (update: { id: string, text: string }) => {
    const cat = categories.value.find(c => c.id === update.id)
    if (cat) {
        cat.text = update.text
    }
}
const handleCategoryToggle = (update: { id: string, enabled: boolean }) => {
    const cat = categories.value.find(c => c.id === update.id)
    if (cat) {
        cat.enabled = update.enabled
    }
}
const handleCategoriesReorder = (reorderedCategories: CategoryDefinition[]) => {
    categories.value = reorderedCategories
}

const boardnameEntered = computed(() => {
    if (boardname.value && boardname.value.trim() !== '') return true
    return false
})

const handleTokenError = () => {
    console.log('Turnstile error occurred')
}
const handleTokenExpired = () => {
    console.log('Turnstile token expired')
    turnstileRef.value?.reset()
}
const handleTokenVerified = (token: string) => {
    isTurnstileVerified.value = true
    turnstileToken.value = token
}

const toast = useToast()

const create = async () => {
    // Todo: Throttle this.
    if (isTurnstileEnabled.value && !isTurnstileVerified.value) return

    const selectedColumns: BoardColumn[] = categories.value.filter(c => c.enabled === true)
        .map(c => ({
            id: c.id,
            text: c.text.trim() || t(`dashboard.columns.${c.id}`),
            isDefault: c.text === '' || c.text === t(`dashboard.columns.${c.id}`),
            color: c.color,
            pos: c.pos
        }))

    const payload: CreateBoardRequest = {
        name: boardname.value,
        team: team.value,
        owner: localStorage.getItem('user') || '',
        columns: selectedColumns,
        cfTurnstileResponse: turnstileToken.value
    }

    isSubmitting.value = true
    try {
        const createdBoard = await createBoard(payload)
        router.push(`/board/${createdBoard.id}`)
    } catch (error) {
        toast.error(t('createBoard.boardCreationError', { pauseOnHover: false }))
        console.error('Error creating board:', error);
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
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
            <div class="glass-card dark:glass-card-dark shadow-brand-lg rounded-2xl p-5 md:p-8 border border-purple-200 dark:border-purple-900 animate-scale-in">
                <!-- Branding Header -->
                <div class="flex items-center justify-center mb-2">
                    <div class="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center shadow-brand">
                        <span class="text-white font-bold text-2xl">FA</span>
                    </div>
                </div>
                <h2 class="text-center text-3xl font-bold tracking-tight gradient-text select-none mb-1">
                    {{ t('createBoard.label') }}
                </h2>
                <p class="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">RetroBoard by Faiz Akram</p>
                <div class="space-y-2 md:space-y-4 mt-4">
                    <div>
                        <div class="mt-1">
                            <input v-model.trim="boardname" name="name" type="text" :maxlength="MAX_TEXT_LENGTH"
                                :placeholder="t('createBoard.namePlaceholder')" required autofocus
                                class="px-2 py-2 mt-1 block w-full rounded-lg border-2 border-purple-200 dark:border-purple-800 shadow-sm focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/50 sm:text-sm dark:bg-slate-800 dark:text-slate-200 transition-all duration-300" />
                        </div>
                        <p v-show="!boardnameEntered" name="name-required"
                            class="text-sm text-red-600 dark:text-red-300 mt-2 select-none">{{
                                t('createBoard.nameRequired') }}</p>
                    </div>
                    <div>
                        <div class="mt-1">
                            <input v-model.trim="team" name="team" type="text" :maxlength="MAX_TEXT_LENGTH"
                                :placeholder="t('createBoard.teamNamePlaceholder')"
                                class="px-2 py-2 mt-1 block w-full rounded-lg border-2 border-purple-200 dark:border-purple-800 shadow-sm focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/50 sm:text-sm dark:bg-slate-800 dark:text-slate-200 transition-all duration-300" />
                        </div>
                    </div>
                    <div>
                        <!-- <ul class="space-y-2 text-sm">
                            <li v-for="(column, index) in columns" :key="column.id" class="flex space-x-1"
                                draggable="true" @dragstart="onDragStart(index)" @dragover="onDragOver"
                                @drop="onDrop(index)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                    stroke="currentColor" class="w-6 h-6 text-gray-900 dark:text-gray-400 cursor-move">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M8 9h.01M16 9h.01M8 15h.01M16 15h.01" />
                                </svg>
                                <button v-if="column.enabled" @click="toggleColumn(column.id, false)">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        class="w-6 h-6" :class="[`${column.colorClass}`]">
                                        <path fill-rule="evenodd"
                                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                                <button v-if="!column.enabled" @click="toggleColumn(column.id, true)">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        class="w-6 h-6 text-gray-500">
                                        <path fill-rule="evenodd"
                                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                                <input type="text" v-model.trim="column.text"
                                    :placeholder="t(`dashboard.columns.${column.id}`)"
                                    class="w-full rounded-md focus:outline-none focus:border focus:border-gray-200 focus:ring-gray-200 dark:text-slate-200 dark:bg-gray-900 dark:focus:border-gray-800 dark:focus:ring-gray-800" />
                            </li>
                        </ul> -->
                        <CategoryEditor :categories="categories" @category-text-update="handleCategoryTextUpdate"
                            @category-toggle="handleCategoryToggle" @categories-reorder="handleCategoriesReorder"
                            @valid="(val: boolean) => isCategorySelectionValid = val">
                        </CategoryEditor>
                    </div>
                    <div class="flex w-full gap-3">
                        <button type="submit"
                            class="btn-ripple flex items-center justify-center px-4 py-3 text-base font-semibold flex-1 shadow-brand bg-gradient-brand hover:bg-gradient-brand-hover text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-400 disabled:cursor-not-allowed disabled:shadow-none rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 dark:focus:ring-2 dark:focus:ring-offset-0 select-none transform hover:scale-105 transition-all duration-300"
                            :disabled="!boardnameEntered || !isCategorySelectionValid || (isTurnstileEnabled && !isTurnstileVerified)"
                            @click="create">
                            {{ isSubmitting ? t('createBoard.buttonProgress') : t('createBoard.button') }}
                        </button>
                        <div
                            class="flex items-center justify-center p-3 shadow-md border rounded-lg border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 hover:shadow-brand transition-all duration-300">
                            <DarkModeToggle class="w-6 h-6 cursor-pointer text-purple-400 hover:text-teal-400" />
                        </div>
                    </div>
                    <div class="w-full">
                        <LanguageSelector />
                    </div>
                    <div v-if="isTurnstileEnabled" class="min-w-[300px] flex items-center justify-center">
                        <TurnstileWidget ref="turnstileRef" v-if="isTurnstileEnabled" class="w-full"
                            :sitekey="turnstileSiteKey" :dark-theme="isDark" @error="handleTokenError"
                            @expired="handleTokenExpired" @verified="handleTokenVerified" />
                    </div>
                    <div v-show="isTurnstileEnabled && !isTurnstileVerified"
                        class="text-sm text-red-600 dark:text-red-300 select-none w-full flex items-center justify-center">
                        {{ t('createBoard.captchaInfo') }}
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