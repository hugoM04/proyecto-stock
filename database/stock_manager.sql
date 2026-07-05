--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1+b1)
-- Dumped by pg_dump version 16.3 (Debian 16.3-1+b1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: acciones; Type: TABLE; Schema: public; Owner: hmalagon
--

CREATE TABLE public.acciones (
    id integer NOT NULL,
    simbolo character varying(10) NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.acciones OWNER TO hmalagon;

--
-- Name: acciones_id_seq; Type: SEQUENCE; Schema: public; Owner: hmalagon
--

CREATE SEQUENCE public.acciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.acciones_id_seq OWNER TO hmalagon;

--
-- Name: acciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hmalagon
--

ALTER SEQUENCE public.acciones_id_seq OWNED BY public.acciones.id;


--
-- Name: compras; Type: TABLE; Schema: public; Owner: hmalagon
--

CREATE TABLE public.compras (
    id integer NOT NULL,
    portafolio_id integer NOT NULL,
    accion_id integer NOT NULL,
    cantidad integer NOT NULL,
    precio_compra numeric(12,2) NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT compras_cantidad_check CHECK ((cantidad > 0)),
    CONSTRAINT compras_precio_compra_check CHECK ((precio_compra >= (0)::numeric))
);


ALTER TABLE public.compras OWNER TO hmalagon;

--
-- Name: compras_id_seq; Type: SEQUENCE; Schema: public; Owner: hmalagon
--

CREATE SEQUENCE public.compras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compras_id_seq OWNER TO hmalagon;

--
-- Name: compras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hmalagon
--

ALTER SEQUENCE public.compras_id_seq OWNED BY public.compras.id;


--
-- Name: portafolios; Type: TABLE; Schema: public; Owner: hmalagon
--

CREATE TABLE public.portafolios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.portafolios OWNER TO hmalagon;

--
-- Name: portafolios_id_seq; Type: SEQUENCE; Schema: public; Owner: hmalagon
--

CREATE SEQUENCE public.portafolios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portafolios_id_seq OWNER TO hmalagon;

--
-- Name: portafolios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hmalagon
--

ALTER SEQUENCE public.portafolios_id_seq OWNED BY public.portafolios.id;


--
-- Name: ventas; Type: TABLE; Schema: public; Owner: hmalagon
--

CREATE TABLE public.ventas (
    id integer NOT NULL,
    portafolio_id integer NOT NULL,
    accion_id integer NOT NULL,
    cantidad integer NOT NULL,
    precio_venta numeric(12,2) NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ventas_cantidad_check CHECK ((cantidad > 0)),
    CONSTRAINT ventas_precio_venta_check CHECK ((precio_venta >= (0)::numeric))
);


ALTER TABLE public.ventas OWNER TO hmalagon;

--
-- Name: ventas_id_seq; Type: SEQUENCE; Schema: public; Owner: hmalagon
--

CREATE SEQUENCE public.ventas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ventas_id_seq OWNER TO hmalagon;

--
-- Name: ventas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hmalagon
--

ALTER SEQUENCE public.ventas_id_seq OWNED BY public.ventas.id;


--
-- Name: acciones id; Type: DEFAULT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.acciones ALTER COLUMN id SET DEFAULT nextval('public.acciones_id_seq'::regclass);


--
-- Name: compras id; Type: DEFAULT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.compras ALTER COLUMN id SET DEFAULT nextval('public.compras_id_seq'::regclass);


--
-- Name: portafolios id; Type: DEFAULT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.portafolios ALTER COLUMN id SET DEFAULT nextval('public.portafolios_id_seq'::regclass);


--
-- Name: ventas id; Type: DEFAULT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.ventas ALTER COLUMN id SET DEFAULT nextval('public.ventas_id_seq'::regclass);


--
-- Data for Name: acciones; Type: TABLE DATA; Schema: public; Owner: hmalagon
--

COPY public.acciones (id, simbolo, nombre) FROM stdin;
1	AAPL	Apple Inc.
2	TSLA	Tesla Inc.
3	IBM	International Business Machines
4	META	Meta Platforms
5	MSFT	Microsoft Corporation
6	GOOGL	Alphabet Inc.
7	AMZN	Amazon.com Inc.
8	NVDA	NVIDIA Corporation
\.


--
-- Data for Name: compras; Type: TABLE DATA; Schema: public; Owner: hmalagon
--

COPY public.compras (id, portafolio_id, accion_id, cantidad, precio_compra, fecha) FROM stdin;
1	1	3	10	250.75	2026-06-23 23:25:48.285757
34	1	1	1	308.45	2026-07-02 22:23:27.610679
35	2	6	2	359.25	2026-07-04 23:38:27.506328
\.


--
-- Data for Name: portafolios; Type: TABLE DATA; Schema: public; Owner: hmalagon
--

COPY public.portafolios (id, nombre, fecha_creacion) FROM stdin;
1	Portafolio 1	2026-06-23 23:16:37.6559
2	Portafolio 2	2026-06-23 23:17:17.533396
\.


--
-- Data for Name: ventas; Type: TABLE DATA; Schema: public; Owner: hmalagon
--

COPY public.ventas (id, portafolio_id, accion_id, cantidad, precio_venta, fecha) FROM stdin;
1	1	1	1	308.45	2026-07-02 22:24:33.045548
\.


--
-- Name: acciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hmalagon
--

SELECT pg_catalog.setval('public.acciones_id_seq', 8, true);


--
-- Name: compras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hmalagon
--

SELECT pg_catalog.setval('public.compras_id_seq', 35, true);


--
-- Name: portafolios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hmalagon
--

SELECT pg_catalog.setval('public.portafolios_id_seq', 2, true);


--
-- Name: ventas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hmalagon
--

SELECT pg_catalog.setval('public.ventas_id_seq', 1, true);


--
-- Name: acciones acciones_pkey; Type: CONSTRAINT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.acciones
    ADD CONSTRAINT acciones_pkey PRIMARY KEY (id);


--
-- Name: acciones acciones_simbolo_key; Type: CONSTRAINT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.acciones
    ADD CONSTRAINT acciones_simbolo_key UNIQUE (simbolo);


--
-- Name: compras compras_pkey; Type: CONSTRAINT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_pkey PRIMARY KEY (id);


--
-- Name: portafolios portafolios_pkey; Type: CONSTRAINT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.portafolios
    ADD CONSTRAINT portafolios_pkey PRIMARY KEY (id);


--
-- Name: ventas ventas_pkey; Type: CONSTRAINT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_pkey PRIMARY KEY (id);


--
-- Name: compras compras_accion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_accion_id_fkey FOREIGN KEY (accion_id) REFERENCES public.acciones(id);


--
-- Name: compras compras_portafolio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_portafolio_id_fkey FOREIGN KEY (portafolio_id) REFERENCES public.portafolios(id);


--
-- Name: ventas ventas_accion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_accion_id_fkey FOREIGN KEY (accion_id) REFERENCES public.acciones(id);


--
-- Name: ventas ventas_portafolio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hmalagon
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_portafolio_id_fkey FOREIGN KEY (portafolio_id) REFERENCES public.portafolios(id);


--
-- PostgreSQL database dump complete
--

