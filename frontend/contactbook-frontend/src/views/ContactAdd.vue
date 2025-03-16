<template>
    <div class="page">
        <h4>Thêm Liên hệ</h4>
        <ContactForm :contact="contact" @submit:contact="createContact" />
        <p> {{ message }} </p>
    </div>
</template>

<script>
import ContactForm from "@/components/ContactForm.vue";
import ContactService from "@/services/contact.service";

export default {
    components: {
        ContactForm,
    },
    data() {
        return {
            contact: new Object(),
            message: "",
        };
    },
    methods: {
        async createContact(data) {
            try {
                this.contact = await ContactService.create(data);
                alert("Thêm thành công một liên hệ mới.");
                this.$router.push({ name: "contactbook" });
            } catch (error) {
                console.log(error);
            }
        },
    },
    created() {
        this.message = "";
    },
};
</script>