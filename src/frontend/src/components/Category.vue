<script setup lang="ts">
import { computed, ref } from 'vue';
import { BoardColumn } from '../models/BoardColumn';
import { useI18n } from 'vue-i18n';
import draggable from 'vuedraggable';

interface Props {
    column: BoardColumn,
    width?: string,
    buttonHighlight: boolean,
    anonymousButtonHighlight: boolean,
    editable: boolean,
    locked: boolean,
    cardCount?: number,
    cards?: any[]
}

const props = withDefaults(defineProps<Props>(), {
    width: 'w-1/3',
    buttonHighlight: false,
    anonymousButtonHighlight: false,
    cardCount: 0,
    cards: () => []
})

const emit = defineEmits(['addCard', 'addAnonymousCard', 'categoryClick', 'cardMoved'])

const { t } = useI18n()

const isDraggingOver = ref(false)

const displayText = computed(() => {
    if (props.column.isDefault) return t(`dashboard.columns.${props.column.id}`)
    return props.column.text
})

const onCategoryClick = () => {
    if (!props.locked) {
        emit('categoryClick')
    }
}

const onDragEnd = (event: any) => {
    if (event.added) {
        // Card was dropped into this category
        const card = event.added.element
        emit('cardMoved', {
            card: card,
            newCategory: props.column.id,
            oldCategory: card.cat
        })
    }
    isDraggingOver.value = false
}

const onDragEnter = () => {
    isDraggingOver.value = true
}

const onDragLeave = () => {
    isDraggingOver.value = false
}

</script>

<template>
    <div class="p-1" :class="[`w-full md:px-6 md:pb-6 md:pt-2 md:${width} min-w-0`]">

        <div class="grid grid-cols-2 gap-1 mb-2 min-w-0">
            <div class="col-span-2 relative flex items-center justify-center p-2 text-sm w-full font-bold rounded-xl border-2 select-none break-words backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300"
                :class="[
                    `bg-${column.color}-100/80`,
                    `border-${column.color}-300`,
                    `text-${column.color}-700`,
                    `dark:bg-${column.color}-800/60`,
                    `dark:border-${column.color}-700`,
                    `dark:text-${column.color}-100`,
                    props.editable && !props.locked && [
                        'cursor-pointer',
                        `hover:bg-${column.color}-200`,
                        `hover:border-${column.color}-400`,
                        `dark:hover:bg-${column.color}-700/80`,
                    ]
                ]" @click="onCategoryClick">
                <span>{{ displayText }}</span>
                <span v-if="cardCount > 0" 
                    class="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-white/90 dark:bg-gray-900/90 shadow-sm"
                    :class="`text-${column.color}-600 dark:text-${column.color}-300`">
                    {{ cardCount }}
                </span>
            </div>
            <button
                class="rounded-xl border-2 font-bold bg-white/80 dark:bg-white/20 hover:bg-white dark:hover:bg-white/30 backdrop-blur-sm select-none p-2 shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200"
                :class="{ 'border-sky-400 dark:border-sky-300 text-sky-500 dark:text-sky-300 ring-2 ring-sky-400/30': buttonHighlight, 'border-gray-300 dark:border-white/20 text-gray-800 dark:text-white hover:border-purple-400 dark:hover:border-purple-400': !buttonHighlight }"
                @click="$emit('addCard')">
                +
            </button>
            <button
                class="rounded-xl border-2 font-semibold bg-white/80 dark:bg-white/20 hover:bg-white dark:hover:bg-white/30 backdrop-blur-sm flex items-center justify-center p-2 shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200"
                :class="{ 'border-sky-400 dark:border-sky-300 text-sky-500 dark:text-sky-300 ring-2 ring-sky-400/30': anonymousButtonHighlight, 'border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:border-purple-400 dark:hover:border-purple-400': !anonymousButtonHighlight }"
                @click="$emit('addAnonymousCard')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                    <path d="M14 18a2 2 0 0 0-4 0" />
                    <path
                        d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11" />
                    <path d="M2 11h20" />
                    <circle cx="17" cy="18" r="3" />
                    <circle cx="7" cy="18" r="3" />
                </svg>
            </button>
        </div>

        <draggable 
            :list="cards"
            group="cards"
            item-key="id"
            :disabled="locked"
            @change="onDragEnd"
            @dragenter="onDragEnter"
            @dragleave="onDragLeave"
            class="min-h-[100px] rounded-xl transition-all duration-300"
            :class="{ 'bg-purple-100/30 dark:bg-purple-900/20 ring-2 ring-purple-400 ring-offset-2': isDraggingOver }">
            <template #item="{ element }">
                <div :data-card-id="element.id">
                    <slot :card="element"></slot>
                </div>
            </template>
        </draggable>
    </div>
</template>