<template>
    <Form @submit="submitContact" :validation-schema="contactFormSchema">
        <div class="form-group">
            <label for="name">Tên</label>
            <Field name="name" type="text" class="form-control" v-model="contactLocal.name"></Field>
            <ErrorMessage name="name" class="error-feedback"/>
        </div>
        <div class="form-group">
            <label for="email">E-mail</label>
            <Field name="email" type="email" class="form-control" v-model="contactLocal.email"></Field>
            <ErrorMessage name="email" class="error-feedback"/>
        </div>
        <div class="form-group">
            <label for="address">Địa chỉ</label>
            <Field name="address" type="text" class="form-control" v-model="contactLocal.address"></Field>
            <ErrorMessage name="address" class="error-feedback"/>
        </div>
        <div class="form-group">
            <label for="phone">Điện thoại</label>
            <Field name="phone" type="tel" class="form-control" v-model="contactLocal.phone"></Field>
            <ErrorMessage name="phone" class="error-feedback"/>
        </div>
        <div class="form-group">
            <label>Ngày làm việc:</label>
            <div v-for="(schedule, index) in contactLocal.workSchedule" :key="index" class="mb-2">
                <select v-model="schedule.day" class="form-control">
                    <option value="Thứ 2">Thứ 2</option>
                    <option value="Thứ 3">Thứ 3</option>
                    <option value="Thứ 4">Thứ 4</option>
                    <option value="Thứ 5">Thứ 5</option>
                    <option value="Thứ 6">Thứ 6</option>
                    <option value="Thứ 7">Thứ 7</option>
                </select>

                <select v-model="schedule.timework" class="form-control mt-2">
                    <option value="Sáng">Sáng</option>
                    <option value="Chiều">Chiều</option>
                    <option value="Cả ngày">Cả ngày</option>
                </select>

                <!-- Nút xóa ngày làm việc -->
                <button type="button" class="btn btn-danger btn-sm mt-2" @click="removeWorkSchedule(index)">Xóa</button>
            </div>

            <!-- Nút thêm ngày làm việc -->
            <button type="button" class="btn btn-secondary mt-2" @click="addWorkSchedule">+ Thêm ngày làm việc</button>
        </div>

        <div class="form-group">
            <div>
                <label>Hình ảnh:</label>
                <input type="file" @change="onFileChange" />
            </div>
            <!-- Ảnh mô phỏng -->
            <div v-if="imagePreview">
                <label>Ảnh mô phỏng:</label>
                <img :src="imagePreview" alt="Ảnh mô phỏng" height="200px">
            </div>

            <!-- Ảnh hiện tại từ DB (sau khi upload thành công) -->
            <div v-if="contactLocal.image">
                <label>Ảnh hiện tại:</label>
                <img :src="contactLocal.image" alt="Ảnh hiện tại" height="200px">
            </div>
        </div>

        <div class="form-group form-check">
            <input name="favorite" type="checkbox" class="form-check-input" v-model="contactLocal.favorite" />
            <label for="favorite" class="form-check-label">
                <strong>Liên hệ yêu thích</strong>
            </label>
        </div>

        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="contactLocal._id" type="button" class="ml-2 btn btn-danger"
                @click="deleteContact">Xóa</button>
            <button type="button" class="ml-2 btn btn-danger" @click="Cancel">Thoát</button>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import axios from 'axios';
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:contact", "delete:contact"],
    props: {
        contact: { type: Object, required: true }
    },
    data() {
        const contactFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải có ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            email: yup
                .string()
                .email("E-mail không đúng.")
                .max(50, "E-mail tối đa 50 ký tự"),
            address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự"),
            phone: yup
                .string()
                .matches(
                    /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    "Số điện thoại không hợp lệ."
                ),
        });
        return {
            contactLocal: this.contact ? this.contact : {
                name: "",
                email: "",
                address: "",
                phone: "",
                image: "",
                favorite: false,
                workSchedule: [], // Đảm bảo có mảng rỗng ngay từ đầu
            },
            contactFormSchema,
            imagePreview: null, 
        };
    },
    methods: {
        async submitContact() {
            // Upload ảnh trước khi gửi form
            if (this.selectedFile) {
                const formData = new FormData();
                formData.append('image', this.selectedFile);
                
                try {
                    const response = await axios.post('http://localhost:3000/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    this.contactLocal.image = response.data.file.url;
                } catch (error) {
                    console.log(error);
                    
                    alert('Failed to upload image');
                    return; // Nếu upload ảnh không thành công thì không tiếp tục submit form
                }
            }


            this.$emit("submit:contact", this.contactLocal);
        },
        deleteContact() {
            this.$emit("delete:contact", this.contactLocal.id);
        },
        addWorkSchedule() {
            if (!this.contactLocal.workSchedule) {
                this.contactLocal.workSchedule = [];
            }
            this.contactLocal.workSchedule.push({ day: "", timework: "" });
        },
        removeWorkSchedule(index) {
          this.contactLocal.workSchedule.splice(index, 1);
        },
        Cancel() {
            const reply = window.confirm("You have unsaved changes! Do you want to leave?")
            if (!reply) {
                return false;
            }
            else this.$router.push({ name: "contactbook" });
        },
        onFileChange(event) {
            this.selectedFile = event.target.files[0];
            if (this.selectedFile) {
                // Tạo URL tạm thời cho ảnh và gán vào imagePreview
                this.imagePreview = URL.createObjectURL(this.selectedFile);
            }
        }
    },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>