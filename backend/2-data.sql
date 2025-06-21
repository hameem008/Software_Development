--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: patient; Type: TABLE DATA; Schema: public; Owner: myuser
--

INSERT INTO public.patient VALUES (1, 'hameem@gmail.com', '$2a$10$0i69hPaehmg94zWNmGAU0uJF9HCaSvu7S3Q8gbi8LFQry50qFWqBS', 'Ha', 'Meem', 'Male', '2002-12-08', 'A+', '01944972610', 'Dhaka, Bangladesh', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');


--
-- Data for Name: allergies; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: doctor; Type: TABLE DATA; Schema: public; Owner: myuser
--

INSERT INTO public.doctor VALUES (1, 'hameem812@gmail.com', '$2a$10$KOGWZXDJFvjF1GzD7OdkX.EAyJFxOlRg//GgffsrHsxsTtCB/knRC', 'Ha', 'Meem', 'Male', 'Neurology', 'Professor', 'Dhaka Medical College', '01944972611', 'Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (2, 'samiaahmed69@gmail.com', '$2a$10$QWCYg6paWpC02thzIYrCj.neDRTsc/7UKFEvs/Ts8yWG9RHOFdIx6', 'Samia', 'Ahmed', 'Female', 'Oncology', 'Assistant Professor', 'National Institute of Cancer Research & Hospital', '01839379694', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (3, 'rajibsaharony58@gmail.com', '$2a$10$HqbtFd0JAt3szCxHEKdN9OAMuz4o7nidoLneL/.u.85O.FqSItN9.', 'Rajib Saha', 'Rony', 'Male', 'Endocrinology', 'Medical Officer', 'Serajdikhan Upazila Health Complex Munshigonj', '01788510568', 'Munshigonj, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (4, 'tanmoyprakashghosh69@gmail.com', '$2a$10$/SHoNPg4UtdZu22ho9onl.iN51KNsrcJXoqgal8jvIWxdD1fbimg2', 'Tanmoy', 'Prakash Ghosh', 'Male', 'Orthopedics', 'Assistant Professor', 'Mymensingh Medical College', '01426728376', 'Mymensingh, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (5, 'mdsaifulislam39@gmail.com', '$2a$10$FNxUtRjpsZHdDUqXbMn7Ie3xCWtB8c1LinU2LFCCxReDIh9Ly2S6C', 'Mohammad Saiful Islam', 'Saif', 'Male', 'Otolaryngology', 'Associate Professor', 'Shaheed Suhrawardy Medical College', '01987652362', 'Mohakhali, Dhaka', NULL, NULL);
INSERT INTO public.doctor VALUES (6, 'farhanayesmin88@gmail.com', '$2a$10$sn1FF/huTLXMS2hzobzgp.qyiwoQSA6J0J.aBHhOdoq4C6czdpjsK', 'Farhana', 'Yesmin', 'Female', 'Gynecology', 'Assistant Professor', 'Bangabandhu Sheikh Mujib Medical University', '01744305610', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (7, 'kazinazrulislam84@gmail.com', '$2a$10$Hh2osK9Xk.8kWQXP8UvQrOORgbq74EsM5gMkTTL0u.wvyl6TjF146', 'Kazi Nazrul', 'Islam', 'Male', 'Cardiology', 'Associate Professor', 'Dhaka Medical College & Hospital', '01551408335', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (8, 'mdalaminmridha82@gmail.com', '$2a$10$jESTOXGDdQWsRHkkFilJ1eIMP4PnYoo6iQkKhZRc0Y33AyPwMFa6.', 'Md Al-Amin', 'Mridha', 'Male', 'Pediatrics', 'Professor', 'Dr. M R Khan Shishu Hospital & Institute of Child Health', '01867060339', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (9, 'essormd.khairulanam73@gmail.com', '$2a$10$VWhd.1uy.pZ6Bx6QosLatuW.JXB1ZajNeD8cB3.8FQVVkph5CquJ.', 'essor Md. Khairul', 'Anam', 'Male', 'Pulmonology', 'Professor', 'National Institute of Diseases of the Chest & Hospital', '01612714338', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (10, 'a.k.m.amirulmorshedkhasru17@gmail.com', '$2a$10$axFtDZwtMjSmKQZyO9GRLOY6HfzvhX1/Vm5EuGxjEv52hr60QETGm', 'A.K.M. Amirul Morshed', 'Khasru', 'Male', 'Hematology', 'Professor', 'Dhaka Medical College & Hospital', '01692936527', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (11, 'abumd.mofakhkharulislamrana31@gmail.com', '$2a$10$OwC3fYi1crja.vpafTNOO.7DqWEWizf9uc2FdkPScJh7vmV8PEqSG', 'Abu Md. Mofakhkharul Islam', 'Rana', 'Male', 'Orthopedics', 'Assistant Professor', 'Bangabandhu Sheikh Mujib Medical University', '01311143191', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (12, 'a.b.m.riazkawsar53@gmail.com', '$2a$10$BzxfLkQbJxBJvkg6AryDeOwY.ZMW2ul2RN/5nT5QKdPvTISjJ7kvy', 'A.B.M. Riaz', 'Kawsar', 'Male', 'Cardiology', 'Assistant Professor', 'National Institute of Cardiovascular Diseases & Hospital', '01422889941', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (13, 'shalahuddinqusarbiplob60@gmail.com', '$2a$10$XXr4HcXOLdOtFULf2cYXhOF4CnDPmm/yM6xvAJqGI/kq/AQ3TZZ4.', 'Shalahuddin Qusar', 'Biplob', 'Male', 'Psychiatry', 'Professor', 'Bangabandhu Sheikh Mujib Medical University', '01931462388', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (14, 'hazerakhatun94@gmail.com', '$2a$10$/6iqlPkg/0ZjWZP3Fh5Zu.4QMmPIUPRQNsn0A8gCV8SOAdGqEYd8O', 'Hazera', 'Khatun', 'Female', 'Gynecology', 'Professor', 'Shaheed Suhrawardy Medical College & Hospital', '01989879255', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (15, 'g.m.ruhulquddus19@gmail.com', '$2a$10$SwjzIwwItRClWWufJM73ze0dbmliH8xMeRfHomQjxJdeYrLXbp7xO', 'G.M. Ruhul', 'Quddus', 'Male', 'Orthopedics', 'Assistant Professor', 'National Institute of Traumatology & Orthopedic Rehabilitation', '01728706203', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (16, 'md.ferdousurrahman82@gmail.com', '$2a$10$jOVrdpiR/rqTJxwJG2MuBeVo79M5P4o/2Ny/4xltWLQFUO2JVfG6m', 'Md. Ferdous Ur', 'Rahman', 'Male', 'Endocrinology', 'Professor', 'Bangabandhu Sheikh Mujib Medical University', '01980000920', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (17, 'md.faizurrahmanfahim88@gmail.com', '$2a$10$.Iq0xJRCHtwH5pubPGiOb.PJPktOfvfZxVwX5OYdtu3C5XEzQwuD6', 'Md. Faizur Rahman', 'Fahim', 'Male', 'Pulmonology', 'Associate Professor', 'Dhaka Medical College & Hospital', '01520103240', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (18, 'm.h.tofayelbiplob89@gmail.com', '$2a$10$OnNMxaTk6zGHA3BPwXRZ/eSeWYtQb/HGcKTwiXidEqvllKcRTd/MS', 'M.H. Tofayel', 'Biplob', 'Male', 'Orthopedics', 'Professor', 'National Institute of Traumatology & Orthopedic Rehabilitation', '01744865246', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (19, 'mohammademran13@gmail.com', '$2a$10$jJEaRp2xqdhkgFA1iX62Ye7M.24UBBLowTsHM8uR7R9DgeGjdfPFm', 'Mohammad', 'Emran', 'Male', 'Otolaryngology', 'Consultant', 'Chittagong Medical College & Hospital', '01794053177', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (20, 'ferozameher76@gmail.com', '$2a$10$b1SeKLRKOJOuiD/txm/6te4XkWZufc.LUbv4xjyktiTlvHzgyruZK', 'Feroza', 'Meher', 'Female', 'Dermatology', 'Consultant', 'Surecell Medical Chattogram', '01313247686', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (21, 'nishithranjandey10@gmail.com', '$2a$10$f3kOjargCj7dGRQ7RcbLWOBQ.0fE48ejllo/Vop2un2ognD2xeEJi', 'Nishith Ranjan', 'Dey', 'Male', 'Dermatology', 'Associate Professor', 'Chittagong Medical College & Hospital', '01566998231', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (22, 'pritishbarua36@gmail.com', '$2a$10$FRKHSXsoasGcqYLONWc1q.qaEUayOe18vqbG5V9s4DjygSIsLY7su', 'Pritish', 'Barua', 'Male', 'Dermatology', 'Consultant', 'Lab One Health Services Chittagong', '01567604079', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (23, 'md.jahangiralamchowdhury53@gmail.com', '$2a$10$4RN7ZpV/27e1T2pHN9A0LO3cQ04YnBTzABveZLXX9DqLptyVYRhXa', 'Md. Jahangir Alam', 'Chowdhury', 'Male', 'Orthopedics', 'Associate Professor', 'Chattogram Maa-O-Shishu Hospital Medical College', '01825993686', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (24, 'nazmunnaharrosy19@gmail.com', '$2a$10$3CPJ7KbT1D5gxyQbOmoG4uLaw.H1a61ro6RlA8kbnY/ILHYOc5M8i', 'Nazmun Nahar', 'Rosy', 'Female', 'Gynecology', 'Consultant', 'Health View Maternity & Child Hospital Chittagong', '01567190215', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (25, 'col.sohelahmed85@gmail.com', '$2a$10$BxmY8Jh.6AWaR2kDHRwyFu8x1NFkROWieWFKVHhCBWhldITZm2ltq', 'Col. Sohel', 'Ahmed', 'Male', 'Gastroenterology', 'Consultant', 'Apollo Imperial Hospital Chittagong', '01425665613', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (26, 'prasenjitbarua17@gmail.com', '$2a$10$t3voqv3yi5Hi66z96F49kunByxDS68/R5WfLSvjO3iHzUjUVpgOTG', 'Prasenjit', 'Barua', 'Male', 'Endocrinology', 'Assistant Professor', 'Chittagong Medical College & Hospital', '01870183059', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (27, 'md.akbarhusainbhuiyan12@gmail.com', '$2a$10$iq8nyK145si.6r/COH.x..z2h4YmBI20/q1iJWeOMnxLGUSrv6d/6', 'Md. Akbar Husain', 'Bhuiyan', 'Male', 'Pediatrics', 'Professor', 'Chittagong Medical College & Hospital', '01815791777', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (28, 's.m.ashrafali66@gmail.com', '$2a$10$hPYK2faF8dLlXv4362gn0.v9PboowF2AuNC4QjC2mLN/QfpeczOhu', 'S.M. Ashraf', 'Ali', 'Male', 'Gastroenterology', 'Professor', 'Marine City Medical College & Hospital', '01641119475', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (29, 'mohammedmaksudulkarim26@gmail.com', '$2a$10$R1zzxw.XlO4AswbE.syHQeNRuG.tx/dEm44p/DTZWrDzwwjIYD40e', 'Mohammed Maksudul', 'Karim', 'Male', 'Endocrinology', 'Consultant', 'Chittagong Medical College & Hospital', '01898620060', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (30, 'm.a.yousufchowdhury26@gmail.com', '$2a$10$zoAzqUTDEkvTWBRpMpXXa.vih1ON0rv1S/pcf.wZUjBEAEQ/vf2I2', 'M. A. Yousuf', 'Chowdhury', 'Male', 'Endocrinology', 'Associate Professor', 'Chittagong Medical College & Hospital', '01997844605', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (31, 'ashfaqahmad59@gmail.com', '$2a$10$df5NKrdmLAQVsYmEfIUuVeb6w1XUWm8IKQgJ08navo/aIGtyq39uC', 'Ashfaq', 'Ahmad', 'Male', 'Otolaryngology', 'Associate Professor', 'Chittagong Medical College & Hospital', '01912826448', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (32, 'md.minhajulhaque21@gmail.com', '$2a$10$FZhnkOdYGzOymtCKunkR.u6Gd4HD0ecCCj3v7aepbdToh/TmtmtJW', 'Md. Minhajul', 'Haque', 'Male', 'Otolaryngology', 'Medical Officer', 'Chittagong General Hospital', '01881907001', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (33, 'rupasreebiswas42@gmail.com', '$2a$10$/r2fXbVSnAFKZryqGbGOleBT0l.3NLD8pyApUa7dPE98ZX3blMUAK', 'Rupasree', 'Biswas', 'Female', 'Gynecology', 'Assistant Professor', 'Southern Medical College & Hospital', '01395078436', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (34, 'mohammadkhaledhossain67@gmail.com', '$2a$10$IcB/DhiTBMl/pqx7t6ORKORDyfa5L0FFL8qPg93fH4GbUZL2AiWWC', 'Mohammad Khaled', 'Hossain', 'Male', 'Pediatrics', 'Consultant', 'Parkview Hospital Chittagong', '01912453794', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (35, 'muslimuddinsobuj92@gmail.com', '$2a$10$wc8GPcoKxwI7eBAHAyt1vuXvhW8W0CiMar8gKgqP6xDN0RxKfT5SO', 'Muslim Uddin', 'Sobuj', 'Male', 'Pediatrics', 'Professor', 'Chittagong Medical College & Hospital', '01498936992', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (36, 'mohammadulhaquemezbah34@gmail.com', '$2a$10$xAy.QTmOJc9GNbY1oNR4/eXgvttTlLcoW1vc..MW2bHm6BQ54l0gq', 'Mohammadul Haque', 'Mezbah', 'Male', 'Ophthalmology', 'Consultant', 'Chittagong Medical College & Hospital', '01799824362', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (37, 'ahmedsharif47@gmail.com', '$2a$10$9MxWSbYfIkOenDnvqGLwBO7D3InSzoBFC3ZYAAmLQEqC2CXjUtm/y', 'Ahmed', 'Sharif', 'Male', 'Otolaryngology', 'Professor', 'Chittagong Medical College & Hospital', '01461230982', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (38, 'alokekumarraha40@gmail.com', '$2a$10$wljb6seOX7k69VK06TwvO.myQQswE37OKJNK20sRoeZZOPjDsa5Vm', 'Aloke Kumar', 'Raha', 'Male', 'Gastroenterology', 'Associate Professor', 'Chittagong Medical College & Hospital', '01689778766', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (39, 'bijankumarnath24@gmail.com', '$2a$10$BtC2/LupR39v7Hal.18wyeYto7jlUGS7Dyn6jp.HXWGpS6mKK2X8O', 'Bijan Kumar', 'Nath', 'Male', 'Gastroenterology', 'Consultant', 'General Hospital Chittagong', '01792156680', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (40, 'md.mizanurrahmanchowdhury20@gmail.com', '$2a$10$FAcO5Dap2PITha7.DbvQ7uobEEBrsNVqXTmgti29HAwfzTt2fW0tW', 'Md. Mizanur Rahman', 'Chowdhury', 'Male', 'Orthopedics', 'Professor', 'Chittagong Medical College & Hospital', '01310540581', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (41, 'md.nurhossainbhuiyan88@gmail.com', '$2a$10$LkvW3uWalOT53Yk3PD83ROYiNhI67YAsatFMj//yp5.s3WyJevs2m', 'Md. Nur Hossain', 'Bhuiyan', 'Male', 'Gastroenterology', 'Associate Professor', 'Dhaka Medical College & Hospital', '01994733890', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (42, 'aminurrahmanazad24@gmail.com', '$2a$10$hSjw91Qelv8.NtUor777duVQsBILaHpvqS7Auo9z8gQTBcAYa6bWC', 'Aminur Rahman', 'Azad', 'Male', 'Neurology', 'Consultant', 'Chittagong Medical College & Hospital', '01747236166', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (43, 'shantanubiswas30@gmail.com', '$2a$10$ZZMuXHewfo0qAP8zIBCAiua/Uk.kYdnwrWf6KRAJ12ejLI5stkbAi', 'Shantanu', 'Biswas', 'Male', 'Gastroenterology', 'Consultant', 'National Gastroliver Institute & Hospital', '01575052943', 'Mohakhali, Dhaka, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (44, 'sheikhmohammadmurad56@gmail.com', '$2a$10$oGwTgl0SgOHCUwVuQ5L8V.gRt/0LViVd1kf9nUl8ljHZ0MQJl/Awy', 'Sheikh Mohammad', 'Murad', 'Male', 'Ophthalmology', 'Consultant', 'Lions Charitable Eye Hospital Chittagong', '01729134025', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (45, 'sm.mizanulhoque22@gmail.com', '$2a$10$hXwtwuUkoIV5vzv5JhIPPuxtevtlR8K9jmMoXyOgGn/2KXDGTt2Eq', 'SM. Mizanul', 'Hoque', 'Male', 'Ophthalmology', 'Consultant', 'Lions Charitable Eye Hospital Chittagong', '01558535277', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (46, 'g.m.zakirhossain22@gmail.com', '$2a$10$XW2EuHCO4ETkj0sqhZ9neu3i8EyQlaGneQWt77hQznYlNKJSqSECe', 'G. M. Zakir', 'Hossain', 'Male', 'Urology', 'Professor', 'Chittagong Medical College & Hospital', '01784250532', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (47, 'mohammedrashedmirjada93@gmail.com', '$2a$10$rv.fyqxbO/.gWpv05iw9tO0Qmgf4elAIULkDTn76RVi6iTbJ.og.m', 'Mohammed Rashed', 'Mirjada', 'Male', 'Endocrinology', 'Associate Professor', 'Chittagong Medical College & Hospital', '01440605050', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (48, 'mirzanurulkarim45@gmail.com', '$2a$10$wfWdrtlmY.MNLjsfCEDXGufQDgC/jKfQatuHWTC4iiVC8JwLHYyiu', 'Mirza Nurul', 'Karim', 'Male', 'Endocrinology', 'Assistant Professor', 'Chittagong Medical College & Hospital', '01626168596', 'Chittagong, Bangladesh', NULL, NULL);
INSERT INTO public.doctor VALUES (49, 'a.k.m.a.sobhan78@gmail.com', '$2a$10$ajenxqRqFq5AJYXECwpL/uXlLt/OoPwMZc2j3uH7cR.OplQD4XGgq', 'A. K. M. A.', 'Sobhan', 'Male', 'Otolaryngology', 'Professor', 'Shaheed Suhrawardy Medical College', '0151825066', 'Mohakhali, Dhaka', NULL, NULL);


--
-- Data for Name: hospital; Type: TABLE DATA; Schema: public; Owner: myuser
--

INSERT INTO public.hospital VALUES (1, 'dmc@gmail.com', '$2a$10$D5N39QPYgV9LRAKlgTtZUOIa9zhsNxBN9k5aTRaxcNsCQu8RXfwjm', 'Dhaka Medical College', 'Near Buet.', '01944972610', 'Dhaka, Bangladesh', NULL);


--
-- Data for Name: doctor_availability; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: appointment; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: chronic_condition; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: diseases; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: prescription; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: diagnosed_diseases; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: doctor_degree; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: doctor_review; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: medicines; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: tests; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: performed_tests; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: prescribed_medicine; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: prescribed_tests; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: refresh_token; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: symptom; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: test_params; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: test_result_value; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Name: appointment_appointment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.appointment_appointment_id_seq', 1, false);


--
-- Name: diseases_disease_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.diseases_disease_id_seq', 1, false);


--
-- Name: doctor_availability_slot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.doctor_availability_slot_id_seq', 1, false);


--
-- Name: doctor_doctor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.doctor_doctor_id_seq', 49, true);


--
-- Name: doctor_review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.doctor_review_review_id_seq', 1, false);


--
-- Name: hospital_hospital_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.hospital_hospital_id_seq', 1, true);


--
-- Name: medicines_medicine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.medicines_medicine_id_seq', 1, false);


--
-- Name: patient_patient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.patient_patient_id_seq', 1, true);


--
-- Name: performed_tests_performed_test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.performed_tests_performed_test_id_seq', 1, false);


--
-- Name: prescription_prescription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.prescription_prescription_id_seq', 1, false);


--
-- Name: tests_test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.tests_test_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

