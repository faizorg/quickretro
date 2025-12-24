<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

interface Props {
    timeLeftInSeconds: number
}

// const props = defineProps<Props>()
const props = withDefaults(defineProps<Props>(), {
    timeLeftInSeconds: 0
})

const emit = defineEmits(['CountdownProgressUpdate', 'OneMinuteLeftWarning', 'CountdownCompleted'])

let interval: any = null
const remainingTime = ref(props.timeLeftInSeconds)

const formattedRemainingTime = computed(() => {
    const minutes = Math.floor(remainingTime.value / 60).toString().padStart(2, '0')
    const seconds = (remainingTime.value % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
})

const startCountdown = () => {
    if (interval) return // Prevent multiple intervals

    emit('CountdownProgressUpdate', true)

    interval = setInterval(() => {
        if (remainingTime.value <= 0) {
            // Todo: On first run/load, interval can be undefined|null. cleanInterval(interval) doesn't seem to error out. Check behaviour in browsers.
            // ..Chrome seems fine. Should we try a check for interval object before clearing it. Doesn't seem necessary.
            clearInterval(interval)
            interval = null
            emit('CountdownProgressUpdate', false)
            emit('CountdownCompleted') // Keeping a separate event for notifying the user that time's up. Can probably reuse "CountdownProgressUpdate", but not sure of it may end up being fired multiple times?
            return
        }
        remainingTime.value--
        if (remainingTime.value === 60) emit('OneMinuteLeftWarning')
    }, 1000)
}

const stopCountdown = () => {
    // Todo: Check for interval truthyness?
    clearInterval(interval)
    interval = null
    emit('CountdownProgressUpdate', false)
}

// Watch for changes in timeLeftInSeconds and reset the timer accordingly
// Note: If we try to add a feature to "Extend" a running timer, and the extended time is the same a the initial time, this watcher won't execute..
//  e.g. Start a timer with 120 secs and while the timer is in progress, props.timeLeftInSeconds 120 secs again. There is no change in value for props.timeLeftInSeconds.
// To fix the above: Check the hack done in - Dashboard.vue.onTimerResponse
watch(
    () => props.timeLeftInSeconds,
    (newValue) => {
        remainingTime.value = newValue
        stopCountdown()
        if (newValue > 0) {
            startCountdown()
        }
    }
)

onMounted(() => {
    if (remainingTime.value > 0) {
        startCountdown()
    }
})

onUnmounted(() => {
    stopCountdown()
})

</script>

<template>
    <div class="select-none font-semibold px-2 py-1 rounded-md transition-all duration-300" 
         :class="remainingTime > 0 
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30' 
            : 'bg-gradient-to-br from-purple-100 to-teal-100 dark:from-gray-800 dark:to-gray-700 border-2 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-white shadow-md'">
        {{ formattedRemainingTime }}
    </div>
</template>