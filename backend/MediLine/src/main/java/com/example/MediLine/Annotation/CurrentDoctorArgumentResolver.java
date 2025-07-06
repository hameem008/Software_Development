package com.example.MediLine.Annotation;

import com.example.MediLine.Entity.Doctor;
import com.example.MediLine.Repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
@RequiredArgsConstructor
public class CurrentDoctorArgumentResolver implements HandlerMethodArgumentResolver {

    private final DoctorRepository doctorRepository;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterAnnotation(CurrentDoctor.class) != null
                && parameter.getParameterType().equals(Doctor.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new IllegalArgumentException("User is not authenticated.");
        }

        String email = authentication.getName();
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No doctor found with email"));
    }
}