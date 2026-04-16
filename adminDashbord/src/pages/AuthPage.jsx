import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import API from "../api/axios";
import {
  Mail,
  Lock,
  User,
  Building2,
  Briefcase,
  Phone,
  MapPin,
  FileText,
  BadgeCheck,
  Upload,
  ArrowRight,
} from "lucide-react";

const allowedRoles = [
  "Visitor (Visiteur)",
  "Investor (Investisseur)",
  "Promoter (Promoteur individuel)",
  "Real Estate Agency (Agence)",
  "Financial Manager (Gestionnaire Fin)",
  "Platform Manager (Gest Plat)",
  "Judicial Agent (Agent Judiciaire)",
  "Customer Support (Support)"
];

function getRoleIcon(role) {
  switch (role) {
    case "Normal User":
      return <User size={18} />;
    case "Real Estate Developer":
      return <Briefcase size={18} />;
    case "Real Estate Agent / Agency":
      return <Building2 size={18} />;
    default:
      return <User size={18} />;
  }
}

function FieldWrapper({ label, icon, children, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
        <div className="text-slate-400">{icon}</div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    role: "",
    fullName: "",
    companyName: "",
    agencyName: "",
    managerName: "",
    email: "",
    phone: "",
    address: "",
    commercialRegistrationNumber: "",
    patentNumber: "",
    nationalIdNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [agencyDocuments, setAgencyDocuments] = useState({
    identityDocument: null,
    patentDocument: null,
    commercialRegistrationDocument: null,
    agencyLicenseDocument: null,
    proofOfAddressDocument: null,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleRegisterChange = (field, value) => {
    setRegisterData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleAgencyDocumentChange = (field, file) => {
    setAgencyDocuments((prev) => ({
      ...prev,
      [field]: file || null,
    }));
  };

  const resetRegisterForm = () => {
    setRegisterData({
      role: "",
      fullName: "",
      companyName: "",
      agencyName: "",
      managerName: "",
      email: "",
      phone: "",
      address: "",
      commercialRegistrationNumber: "",
      patentNumber: "",
      nationalIdNumber: "",
      password: "",
      confirmPassword: "",
    });

    setAgencyDocuments({
      identityDocument: null,
      patentDocument: null,
      commercialRegistrationDocument: null,
      agencyLicenseDocument: null,
      proofOfAddressDocument: null,
    });
  };

  const validateAgencyDocuments = () => {
    return (
      agencyDocuments.identityDocument &&
      agencyDocuments.patentDocument &&
      agencyDocuments.commercialRegistrationDocument &&
      agencyDocuments.agencyLicenseDocument &&
      agencyDocuments.proofOfAddressDocument
    );
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("info");
    setLoading(true);

    try {
      const response = await API.post("/login", {
        email: loginData.email,
        password: loginData.password,
      });

      const data = response.data;

      setMessageType("success");
      setMessage(data?.message || "Login successful.");

      if (data?.role === "Admin") {
        navigate("/admin/project-validation");
      } else if (data?.role === "Financial Manager (Gestionnaire Fin)") {
        navigate("/finance/transactions");
      } else if (data?.role === "Judicial Agent (Agent Judiciaire)") {
        navigate("/judicial/disputes");
      } else if (data?.role === "Customer Support (Support)") {
        navigate("/support/user-management");
      } else if (data?.role === "Promoter (Promoteur individuel)" || data?.role === "Real Estate Agency (Agence)") {
        navigate("/promoter");
      } else if (data?.role === "Investor (Investisseur)") {
        navigate("/investor");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setMessageType("error");
      setMessage(
        error?.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("info");

    if (!allowedRoles.includes(registerData.role)) {
      setMessageType("error");
      setMessage("Please select a valid role.");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setMessageType("error");
      setMessage("Password and confirm password do not match.");
      return;
    }

    const individualRoles = [
      "Visitor (Visiteur)",
      "Investor (Investisseur)",
      "Financial Manager (Gestionnaire Fin)",
      "Platform Manager (Gest Plat)",
      "Judicial Agent (Agent Judiciaire)",
      "Customer Support (Support)"
    ];

    if (individualRoles.includes(registerData.role)) {
      if (
        !registerData.fullName.trim() ||
        !registerData.email.trim() ||
        !registerData.password.trim()
      ) {
        setMessageType("error");
        setMessage("Please fill in all required fields.");
        return;
      }
    }

    if (registerData.role === "Promoter (Promoteur individuel)") {
      if (
        !registerData.fullName.trim() ||
        !registerData.companyName.trim() ||
        !registerData.email.trim() ||
        !registerData.phone.trim() ||
        !registerData.password.trim()
      ) {
        setMessageType("error");
        setMessage("Please fill in all required fields.");
        return;
      }
    }

    if (registerData.role === "Real Estate Agency (Agence)") {
      const requiredAgencyFields =
        registerData.agencyName.trim() &&
        registerData.managerName.trim() &&
        registerData.email.trim() &&
        registerData.phone.trim() &&
        registerData.address.trim() &&
        registerData.commercialRegistrationNumber.trim() &&
        registerData.patentNumber.trim() &&
        registerData.nationalIdNumber.trim() &&
        registerData.password.trim();

      if (!requiredAgencyFields) {
        setMessageType("error");
        setMessage("Please complete all required agency fields.");
        return;
      }

      if (!validateAgencyDocuments()) {
        setMessageType("error");
        setMessage("All agency identification documents are required.");
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(registerData).forEach((key) => {
        formData.append(key, registerData[key]);
      });

      if (registerData.role === "Real Estate Agency (Agence)") {
        Object.keys(agencyDocuments).forEach((key) => {
          if (agencyDocuments[key]) {
            formData.append(key, agencyDocuments[key]);
          }
        });
      }

      const response = await API.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      setMessageType("success");
      setMessage(
        data?.message ||
        "Account request submitted successfully. Please verify your email."
      );

      resetRegisterForm();
      setMode("login");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error?.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen rtl:text-right bg-[#f7f7fb] selection:bg-indigo-500/30">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-950">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-fuchsia-950 mix-blend-multiply"></div>
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-xl shadow-fuchsia-500/30">
                <Building2 size={24} />
              </div>
              <span className="text-3xl font-black tracking-tight text-white">
                MicroInvest
              </span>
            </div>
            <div className="mt-6 flex">
              <LanguageSwitcher />
            </div>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-5xl font-black leading-tight text-white">
              {t("auth.secureGateway")}
            </h1>
            <p className="mt-6 text-lg text-indigo-100/80 leading-relaxed">
              {t("auth.startJourney")}
            </p>
          </div>
          
          <div className="text-sm font-medium text-indigo-200/60">
            &copy; 2026 MicroInvest Platform. All rights reserved.
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-10 lg:hidden flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg">
                <Building2 size={20} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                MicroInvest
              </span>
            </div>
            <LanguageSwitcher />
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900">
              {mode === "login" ? t("auth.welcome") : t("auth.join")}
            </h2>
            <p className="mt-3 text-slate-500 text-[15px]">
              {mode === "login" ? t("auth.welcomeSub") : t("auth.signUpForm")}
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 rounded-2xl px-4 py-3 text-sm ${messageType === "error"
                ? "border border-red-100 bg-red-50 text-red-700"
                : messageType === "success"
                  ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                  : "border border-indigo-100 bg-indigo-50 text-indigo-700"
                }`}
            >
              {message}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <FieldWrapper
                label={t("auth.emailLabel")}
                icon={<Mail size={18} />}
                required
              >
                <input
                  type="email"
                  placeholder="admin@admin.com"
                  name="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full outline-none bg-transparent"
                  required
                />
              </FieldWrapper>

              <FieldWrapper
                label={t("auth.passwordLabel")}
                icon={<Lock size={18} />}
                required
              >
                <input
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full outline-none bg-transparent"
                  required
                />
              </FieldWrapper>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-fuchsia-500/20 disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                ) : (
                  <>
                    {t("auth.signInBtn")} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <FieldWrapper
                label={t("auth.roleLabel")}
                icon={getRoleIcon(registerData.role || "Normal User")}
                required
              >
                <select
                  value={registerData.role}
                  onChange={(e) => handleRegisterChange("role", e.target.value)}
                  className="w-full bg-transparent outline-none"
                  required
                >
                  <option value="">{t("auth.roleLabel")}</option>
                  {allowedRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </FieldWrapper>

              {["Visitor (Visiteur)", "Investor (Investisseur)", "Financial Manager (Gestionnaire Fin)", "Platform Manager (Gest Plat)", "Judicial Agent (Agent Judiciaire)", "Customer Support (Support)"].includes(registerData.role) && (
                <>
                  <FieldWrapper
                    label={t("auth.fullName")}
                    icon={<User size={18} />}
                    required
                  >
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={registerData.fullName}
                      onChange={(e) =>
                        handleRegisterChange("fullName", e.target.value)
                      }
                      className="w-full outline-none bg-transparent"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label={t("auth.emailLabel")}
                    icon={<Mail size={18} />}
                    required
                  >
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={registerData.email}
                      onChange={(e) =>
                        handleRegisterChange("email", e.target.value)
                      }
                      className="w-full outline-none bg-transparent"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label={t("auth.passwordLabel")}
                    icon={<Lock size={18} />}
                    required
                  >
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) =>
                        handleRegisterChange("password", e.target.value)
                      }
                      className="w-full outline-none bg-transparent"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Confirm Password"
                    icon={<BadgeCheck size={18} />}
                    required
                  >
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        handleRegisterChange("confirmPassword", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>
                </>
              )}

              {registerData.role === "Promoter (Promoteur individuel)" && (
                <>
                  <FieldWrapper
                    label="Full Name"
                    icon={<User size={18} />}
                    required
                  >
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={registerData.fullName}
                      onChange={(e) =>
                        handleRegisterChange("fullName", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Company Name"
                    icon={<Building2 size={18} />}
                    required
                  >
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={registerData.companyName}
                      onChange={(e) =>
                        handleRegisterChange("companyName", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Email Address"
                    icon={<Mail size={18} />}
                    required
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) =>
                        handleRegisterChange("email", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Phone Number"
                    icon={<Phone size={18} />}
                    required
                  >
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={registerData.phone}
                      onChange={(e) =>
                        handleRegisterChange("phone", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Password"
                    icon={<Lock size={18} />}
                    required
                  >
                    <input
                      type="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) =>
                        handleRegisterChange("password", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Confirm Password"
                    icon={<BadgeCheck size={18} />}
                    required
                  >
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        handleRegisterChange("confirmPassword", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>
                </>
              )}

              {registerData.role === "Real Estate Agency (Agence)" && (
                <>
                  <FieldWrapper
                    label="Agency Name"
                    icon={<Building2 size={18} />}
                    required
                  >
                    <input
                      type="text"
                      placeholder="Enter agency name"
                      value={registerData.agencyName}
                      onChange={(e) =>
                        handleRegisterChange("agencyName", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Manager Full Name"
                    icon={<User size={18} />}
                    required
                  >
                    <input
                      type="text"
                      placeholder="Enter manager full name"
                      value={registerData.managerName}
                      onChange={(e) =>
                        handleRegisterChange("managerName", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Email Address"
                    icon={<Mail size={18} />}
                    required
                  >
                    <input
                      type="email"
                      placeholder="Enter agency email"
                      value={registerData.email}
                      onChange={(e) =>
                        handleRegisterChange("email", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Phone Number"
                    icon={<Phone size={18} />}
                    required
                  >
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={registerData.phone}
                      onChange={(e) =>
                        handleRegisterChange("phone", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Address"
                    icon={<MapPin size={18} />}
                    required
                  >
                    <input
                      type="text"
                      placeholder="Enter agency address"
                      value={registerData.address}
                      onChange={(e) =>
                        handleRegisterChange("address", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Commercial Registration Number"
                    icon={<FileText size={18} />}
                    required
                  >
                    <input
                      type="text"
                      placeholder="Enter commercial registration number"
                      value={registerData.commercialRegistrationNumber}
                      onChange={(e) =>
                        handleRegisterChange(
                          "commercialRegistrationNumber",
                          e.target.value
                        )
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Patent Number"
                    icon={<FileText size={18} />}
                    required
                  >
                    <input
                      type="text"
                      placeholder="Enter patent number"
                      value={registerData.patentNumber}
                      onChange={(e) =>
                        handleRegisterChange("patentNumber", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="National ID Number"
                    icon={<BadgeCheck size={18} />}
                    required
                  >
                    <input
                      type="text"
                      placeholder="Enter national ID number"
                      value={registerData.nationalIdNumber}
                      onChange={(e) =>
                        handleRegisterChange(
                          "nationalIdNumber",
                          e.target.value
                        )
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Identity Document"
                    icon={<Upload size={18} />}
                    required
                  >
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) =>
                        handleAgencyDocumentChange(
                          "identityDocument",
                          e.target.files?.[0]
                        )
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Patent Document"
                    icon={<Upload size={18} />}
                    required
                  >
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) =>
                        handleAgencyDocumentChange(
                          "patentDocument",
                          e.target.files?.[0]
                        )
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Commercial Registration Document"
                    icon={<Upload size={18} />}
                    required
                  >
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) =>
                        handleAgencyDocumentChange(
                          "commercialRegistrationDocument",
                          e.target.files?.[0]
                        )
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Agency License / Authorization"
                    icon={<Upload size={18} />}
                    required
                  >
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) =>
                        handleAgencyDocumentChange(
                          "agencyLicenseDocument",
                          e.target.files?.[0]
                        )
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Proof of Address"
                    icon={<Upload size={18} />}
                    required
                  >
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) =>
                        handleAgencyDocumentChange(
                          "proofOfAddressDocument",
                          e.target.files?.[0]
                        )
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Password"
                    icon={<Lock size={18} />}
                    required
                  >
                    <input
                      type="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) =>
                        handleRegisterChange("password", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Confirm Password"
                    icon={<BadgeCheck size={18} />}
                    required
                  >
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        handleRegisterChange("confirmPassword", e.target.value)
                      }
                      className="w-full outline-none"
                      required
                    />
                  </FieldWrapper>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-md ${loading
                  ? "cursor-not-allowed bg-slate-400"
                  : "bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                  }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-slate-500">
            {mode === "login" ? (
              <p>
                {t("auth.noAccount") || "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); setMessage(""); }}
                  className="font-semibold text-indigo-600 hover:text-fuchsia-600 transition-colors underline underline-offset-2"
                >
                  {t("auth.signUpLink") || "Sign Up"}
                </button>
              </p>
            ) : (
              <p>
                {t("auth.alreadyHaveAccount") || "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setMessage(""); }}
                  className="font-semibold text-indigo-600 hover:text-fuchsia-600 transition-colors underline underline-offset-2"
                >
                  {t("auth.signInLink") || "Sign In"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}