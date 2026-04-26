package com.bankingSimulationSystem.workFlow.exception;

import com.bankingSimulationSystem.workFlow.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

//    @ExceptionHandler(RuntimeException.class)
//    public ResponseEntity<?> handleRuntime(RuntimeException ex){
//        return ResponseEntity.badRequest().body(ex.getMessage());
//    }
//
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex){
//
//        Map<String,String> errors = new HashMap<>();
//
//        ex.getBindingResult().getFieldErrors().forEach(error ->
//                errors.put(error.getField(),error.getDefaultMessage())
//        );
//
//        return ResponseEntity.badRequest().body(errors);
//    }

        // 🔴 Resource not found
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex){

            ErrorResponse error = ErrorResponse.builder()
                    .message(ex.getMessage())
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .time(LocalDateTime.now())
                    .build();

            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        // 🔴 Bad request
        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex){

            ErrorResponse error = ErrorResponse.builder()
                    .message(ex.getMessage())
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .time(LocalDateTime.now())
                    .build();

            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        // 🔴 Validation errors
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex){

            String msg = ex.getBindingResult()
                    .getFieldError()
                    .getDefaultMessage();

            ErrorResponse error = ErrorResponse.builder()
                    .message(msg)
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .time(LocalDateTime.now())
                    .build();

            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        // 🔴 Generic fallback
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGeneric(Exception ex){

            ErrorResponse error = ErrorResponse.builder()
                    .message(ex.getMessage())
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .time(LocalDateTime.now())
                    .build();

            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
