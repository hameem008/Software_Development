package com.example.MediLine.Annotation;

import com.example.MediLine.Entity.Patient;
import com.example.MediLine.Repository.PatientRepository;
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
public class CurrentPatientArgumentResolver implements HandlerMethodArgumentResolver {

    private final PatientRepository patientRepository;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterAnnotation(CurrentPatient.class) != null
                && parameter.getParameterType().equals(Patient.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new IllegalArgumentException("User is not authenticated.");
        }

        String email = authentication.getName();
        return patientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No patient found with email: " + email));
    }
}

