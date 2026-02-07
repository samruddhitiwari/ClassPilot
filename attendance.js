import { supabase } from "./supabaseClient.js";

const form = document.querySelector("#attendance-form");
const rosterSection = document.querySelector("#roster");
const studentsContainer = document.querySelector("#students");
const statusEl = document.querySelector("#status");
const classIdInput = document.querySelector("#class-id");
const dateInput = document.querySelector("#attendance-date");
const notesInput = document.querySelector("#attendance-notes");
const markAllPresentBtn = document.querySelector("#mark-all-present");
const markAllAbsentBtn = document.querySelector("#mark-all-absent");
const saveBtn = document.querySelector("#save-attendance");

const queryParams = new URLSearchParams(window.location.search);
if (queryParams.get("class_id")) {
  classIdInput.value = queryParams.get("class_id");
}
if (queryParams.get("date")) {
  dateInput.value = queryParams.get("date");
}

const state = {
  students: [],
  statuses: new Map(),
};

const setStatus = (message, tone = "muted") => {
  statusEl.textContent = message;
  statusEl.className = `status ${tone}`;
};

const buildStudentRow = (student) => {
  const row = document.createElement("div");
  row.className = "student-row";

  const name = document.createElement("div");
  name.className = "student-name";
  name.innerHTML = `<strong>${student.full_name}</strong><span>${student.email || ""}</span>`;

  const select = document.createElement("select");
  select.name = `status-${student.id}`;
  ["present", "absent", "late", "excused"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value.charAt(0).toUpperCase() + value.slice(1);
    select.append(option);
  });

  select.value = state.statuses.get(student.id) || "present";
  select.addEventListener("change", () => {
    state.statuses.set(student.id, select.value);
  });

  row.append(name, select);
  return row;
};

const renderRoster = () => {
  studentsContainer.innerHTML = "";
  state.students.forEach((student) => {
    studentsContainer.append(buildStudentRow(student));
  });
};

const loadRoster = async () => {
  const classId = classIdInput.value.trim();
  const date = dateInput.value;
  if (!classId || !date) {
    setStatus("Provide a class ID and date to load the roster.", "warning");
    return;
  }

  setStatus("Loading roster...");
  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, email")
    .eq("class_id", classId)
    .order("full_name", { ascending: true });

  if (error) {
    setStatus(`Failed to load roster: ${error.message}`, "error");
    return;
  }

  state.students = data || [];
  state.statuses = new Map(state.students.map((student) => [student.id, "present"]));
  renderRoster();
  rosterSection.hidden = false;
  setStatus(`Loaded ${state.students.length} students.`, "success");
};

const bulkSet = (status) => {
  state.students.forEach((student) => {
    state.statuses.set(student.id, status);
  });
  renderRoster();
};

const saveAttendance = async () => {
  if (!state.students.length) {
    setStatus("Load a roster first.", "warning");
    return;
  }

  const classId = classIdInput.value.trim();
  const date = dateInput.value;
  const sharedNotes = notesInput.value.trim();

  const payload = state.students.map((student) => ({
    class_id: classId,
    student_id: student.id,
    attendance_date: date,
    status: state.statuses.get(student.id) || "present",
    notes: sharedNotes || null,
  }));

  setStatus("Saving attendance...");
  const { error } = await supabase
    .from("attendance")
    .upsert(payload, { onConflict: "student_id,attendance_date" });

  if (error) {
    setStatus(`Failed to save attendance: ${error.message}`, "error");
    return;
  }

  setStatus("Attendance saved successfully.", "success");
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadRoster();
});

markAllPresentBtn.addEventListener("click", () => bulkSet("present"));
markAllAbsentBtn.addEventListener("click", () => bulkSet("absent"));
saveBtn.addEventListener("click", saveAttendance);

if (classIdInput.value && dateInput.value) {
  loadRoster();
}
