<script>
export default {
    props: {
        contact: { type: Object, required: true },
    },
};
</script>
<template>
    <div>
        <div class="p-1">
            <strong>Tên:</strong>
            {{ contact.name }}
        </div>
        <div class="p-1">
            <strong>Email:</strong>
            {{ contact.email }}
        </div>
        <div class="p-1">
            <strong>Địa chỉ:</strong>
            {{ contact.address }}
        </div>
        <div class="p-1">
            <strong>Điện thoại:</strong>
            {{ contact.phone }}
        </div>
        <div class="p-1">
            <strong>Ngày làm việc trong tuần:</strong>
            <span v-if="contact.workSchedule && contact.workSchedule.length > 0">
                <span v-for="(schedule, index) in contact.workSchedule" :key="index">
                    {{ schedule.day }} ({{ schedule.timework }}) <span v-if="index !== contact.workSchedule.length - 1">, </span>
                </span>
            </span>
            <span v-else>(Không có lịch làm việc)</span>
       </div>
        <div class="p-1">
            <strong>Liên hệ yêu thích:&nbsp;</strong>
            <i v-if="contact.favorite" class="fas fa-check"></i>
            <i v-else class="fas fa-times"></i>
        </div>
    </div>
</template>