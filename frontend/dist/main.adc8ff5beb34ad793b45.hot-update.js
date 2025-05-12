"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdateadverly_frontend"]("main",{

/***/ "./src/redux/slices/formSlice.ts":
/*!***************************************!*\
  !*** ./src/redux/slices/formSlice.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Categories: () => (/* binding */ Categories),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   resetForm: () => (/* binding */ resetForm),\n/* harmony export */   selectFormData: () => (/* binding */ selectFormData),\n/* harmony export */   setFormDataForEdit: () => (/* binding */ setFormDataForEdit),\n/* harmony export */   setItemToEdit: () => (/* binding */ setItemToEdit),\n/* harmony export */   updateField: () => (/* binding */ updateField),\n/* harmony export */   updatePhoto: () => (/* binding */ updatePhoto),\n/* harmony export */   updateStep: () => (/* binding */ updateStep)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"./node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs\");\nvar _a;\n\nvar Categories = {\n    REAL_ESTATE: \"Недвижимость\",\n    AUTO: \"Авто\",\n    SERVICES: \"Услуги\",\n};\nvar initialState = {\n    formData: {\n        name: \"\",\n        description: \"\",\n        location: \"\",\n        photo: null,\n        category: Categories.REAL_ESTATE, // Default category\n        year: year\n    },\n    step: 1,\n    isEditing: false,\n};\nvar unifiedFormSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({\n    name: \"form\",\n    initialState: initialState,\n    reducers: {\n        updateField: function (state, action) {\n            var _a = action.payload, field = _a.field, value = _a.value;\n            state.formData[field] = value;\n            if (field === \"category\") {\n                state.step = 1; // Reset step when category changes\n            }\n        },\n        updatePhoto: function (state, action) {\n            state.formData.photo = action.payload;\n        },\n        updateStep: function (state, action) {\n            state.step = action.payload;\n        },\n        resetForm: function (state) {\n            state.formData = initialState.formData;\n            state.step = initialState.step;\n            state.isEditing = initialState.isEditing;\n        },\n        setFormDataForEdit: function (state, action) {\n            state.isEditing = true;\n            state.formData = action.payload;\n        },\n        setItemToEdit: function (state, action) {\n            state.isEditing = true;\n            state.step = 2;\n            state.formData = action.payload;\n        },\n    },\n});\nvar updateField = (_a = unifiedFormSlice.actions, _a.updateField), updatePhoto = _a.updatePhoto, updateStep = _a.updateStep, resetForm = _a.resetForm, setFormDataForEdit = _a.setFormDataForEdit, setItemToEdit = _a.setItemToEdit;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (unifiedFormSlice.reducer);\nvar selectFormData = function (state) {\n    return state.form.formData;\n};\n\n\n//# sourceURL=webpack://adverly-frontend/./src/redux/slices/formSlice.ts?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("334769d01ae1055434ff")
/******/ })();
/******/ 
/******/ }
);