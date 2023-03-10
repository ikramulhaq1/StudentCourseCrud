var std = '';
$(document).ready(function () {
    getStudentsData();
    getCoursesInDD();
    //$('.multi_select').selectpicker();
    $("#btnUpdateStd").click(function () {
        if (std != '') {
            updateStudentData(std)
        } else {
            alert("No Employee id Found Or Update!")
        }
    });
});
function createStudent() {
    var url = "https://localhost:7185/api/Students?courseId=1";
    var student = {};

    if ($('#txtName').val() === '' || $('#txtfatherName').val() === '' || $('#txtAddress').val() === '') {
        alert("No Field can be left blank!");
    }
    else {
        student.Name = $('#txtName').val();
        student.FatherName = $('#txtfatherName').val();
        student.Address = $('#txtAddress').val();
        student.courses = $('#txtCourse').val();


        if (student) {
            $.ajax({

                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(student),
                type: "Post",
                success: function (result) {

                    clearForm();
                    getStudentsData();
                },
                error: function (msg) {
                    alert(msg);
                }

            });
        }
    }
}

function getStudentsData() {
    var url = "https://localhost:7185/api/students";

    $.ajax({

        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        success: function (result) {
            if (result) {
                $("#tblStdBody").html('');
                var row = '';
                for (var i = 0; i < result.length; i++) {
                    //var course = result[i].courses.map(e => e.name)
                    row = row
                        + "<tr>"
                        + "<td>" + result[i].id + "</td>"
                        + "<td>" + result[i].name + "</td>"
                        + "<td>" + result[i].fatherName + "</td>"
                        + "<td>" + result[i].address + "</td>"
                        + "<td>" + result[i].course + "</td>"
                        // + "<td>" + course[i].id + "</td>"

                        + "<td><button class='btn btn-warning' onClick='editStudentData(" + result[i].id + ")'>Edit</button>&nbsp;&nbsp; | &nbsp;&nbsp;<button class='btn btn-danger' onClick='deleteStudentData(" + result[i].id + ")'>Delete</button></td>"
                }
                if (row != '') {
                    $("#tblStdBody").append(row);
                }
            }
        },
        error: function (msg) {
            alert(msg);
        }

    });
}

//function createCourseData() {
//    //$('#tblDdl').on("change", function () {
//    //    var item = $("#tblDdl option:selected").text();

//    //    $.post("https://localhost:7185/api/courses",
//    //        {
//    //            data: item
//    //    });
//    //});
//    var url = "https://localhost:7185/api/courses";
//    var courses = {};

//    if (courses) {
//        $.ajax({
//            url: url,
//            contenttype: "application/json; charset=utf-8",
//            datatype: "json",
//            data: JSON.stringify(courses),
//            type: "Post",
//            success: function (result) {
//                $.each(result, function (i, course) {
//                    $('#tblDdl').append('<option value=' + course.id + '>' + course.name + '</option>');
//                });
//                $('#tblDdl').on("change", function () {
//                    courses = $("#tblDdl option:selected").text();
//                    course = courses
//                });
//            },
//            error: function (msg) {
//                alert(msg);
//            }

//        });
//    }

//}

function getCoursesInDD() {
    var url = "https://localhost:7185/api/courses";

    $.ajax({

        url: url,
        //contentType: "application/json; charset=utf-8",
        //dataType: "json",
        //type: "Get",
        success: function (result) {
            $.each(result, function (i, data) {
                $('#tblDdl').append('<option value=' + data.id + '>' + data.name + '</option>');
            });
        },
        error: function (msg) {
            alert(msg);
        }

    });
}

function deleteStudentData(id) {
    var url = "https://localhost:7185/api/students/" + id;

    $.ajax({

        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Delete",
        success: function (result) {
            clearForm();
            alert('Are You Sure You Want To Delete This Record!');
            getStudentsData();
        },
        error: function (msg) {
            alert(msg);
        }

    });
}

function editStudentData(id) {
    var url = "https://localhost:7185/api/students/" + id;

    $.ajax({

        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        success: function (result) {
            if (result) {
                std = result.id;
                $('#txtName').val(result.name);
                $('#txtfatherName').val(result.fatherName);
                $('#txtAddress').val(result.address);
                //$('#txtCourse').val(result);
            }
            $("#btnCreateStd").prop('disabled', true);
            $("#btnUpdateStd").prop('disabled', false);
        },
        error: function (msg) {
            alert(msg);
        }

    });
}

function updateStudentData(id) {
    var url = "api/students/" + id;
    var student = {};
    student.id = std;
    student.Name = $('#txtName').val();
    student.FatherName = $('#txtfatherName').val();
    student.Address = $('#txtAddress').val();
    /*student.courses = $('#txtCourse').val();*/

    if (student) {
        $.ajax({
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(student),
            type: 'Put',
            success: function (result) {
                clearForm();
                getStudentsData();
                $("#btnCreateStd").prop('disabled', false);
                $("#btnUpdateStd").prop('disabled', true);
            },
            error: function (msg) {
                alert(msg);
            }

        });
    }
}



function clearForm() {
    $('#txtName').val('');
    $('#txtfatherName').val('');
    $('#txtAddress').val('');
    $('#txtCourse').val('');
}