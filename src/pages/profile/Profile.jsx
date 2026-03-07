import { useState } from "react";
import CardList from "../../components/ui/CardList.jsx";
import CardGlassBlur2 from "../../components/ui/CardGlassBlur2.jsx";
import InputFileUpload from "../../components/ui/InputFileUpload.jsx";
import { useSelector } from "react-redux";
import BackButton from "../../components/ui/BackButton.jsx";
import {useNavigate} from "react-router-dom";

function Profile() {
    const user = useSelector((state) => state.auth.profile);
    const navigate = useNavigate();
    const [username, setUsername]   = useState(user.username   ?? "");
    const [firstName, setFirstName] = useState(user.firstName  ?? "");
    const [lastName, setLastName]   = useState(user.lastName   ?? "");
    const [phone, setPhone]         = useState(user.phoneNumber ?? "");

    return (
        <CardList>
        <BackButton onClick={() => navigate("/admin")}/>
            {/* ── 1. Hero / Identity card ─────────────────────────────────── */}
            <CardGlassBlur2>
                {/* Banner strip */}
                <div className="relative h-12 rounded-xl overflow-hidden mb-10">

                    {/* Role badge */}
                    <span className="absolute top-3 right-4
                           text-[10px] font-bold tracking-widest uppercase
                           text-cyan-200 border border-cyan-400/40
                           bg-cyan-900/30 backdrop-blur-sm
                           px-3 py-1 rounded-full">
            {user.role}
          </span>
                </div>

                {/* Avatar + name row — overlaps banner */}
                <div className="flex items-end justify-between -mt-16 px-2">
                    {/* Avatar with glowing ring */}
                    <div className="relative">
                        <div className="p-[3px] rounded-full
                            bg-gradient-to-br from-cyan-400 to-indigo-500
                            shadow-[0_0_20px_rgba(6,182,212,0.45)]">
                            <div className="rounded-full border-[3px] border-slate-900 overflow-hidden w-20 h-20">
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {/* online dot */}
                        <span className="absolute bottom-1 right-1
                             w-4 h-4 rounded-full bg-emerald-400
                             border-2 border-slate-900
                             shadow-[0_0_8px_#34d399]" />
                    </div>

                    {/* Name block */}
                    <div className="text-right pb-1">
                        <p className="text-lg font-bold text-slate-100 leading-tight tracking-tight">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-white mt-0.5">@{user.username}</p>
                    </div>
                </div>

                {/* Quick stats row */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                    {[
                        { label: "User ID",  value: `#${user.id}` },
                        { label: "Phone",    value: `+${user.phoneNumber}` },
                        { label: "Birthday", value: user.dateOfBirth },
                    ].map(({ label, value }) => (
                        <div key={label}
                             className="bg-white/5 border border-white/[0.06] rounded-xl
                            px-3 py-3 text-center">
                            <p className="text-[9px] font-bold tracking-widest uppercase text-white mb-1">
                                {label}
                            </p>
                            <p className="text-xs font-semibold text-white truncate">{value}</p>
                        </div>
                    ))}
                </div>
            </CardGlassBlur2>

            {/* ── 2. Photo upload card ─────────────────────────────────────── */}
            <CardGlassBlur2>
                <p className="text-[10px] font-bold tracking-widest uppercase text-white mb-4">
                    Profile Photo
                </p>

                <div className="flex items-center gap-4
                        border border-dashed border-cyan-500/25
                        rounded-xl p-4 bg-white/[0.02]">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden
                          border border-white/10 flex-shrink-0">
                        <img src={user.avatar} alt="thumb" className="w-full h-full object-cover" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">Change picture</p>
                        <p className="text-[11px] text-white mt-0.5">JPG or PNG · max 5 MB</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                        <InputFileUpload />
                        <button
                            disabled
                            className="text-[11px] font-semibold text-red-400/40
                         border border-red-400/20 rounded-lg px-3 py-1.5
                         cursor-not-allowed"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </CardGlassBlur2>

            {/* ── 3. Edit profile card ─────────────────────────────────────── */}
            <CardGlassBlur2>
                <p className="text-[10px] font-bold tracking-widest uppercase text-white mb-4">
                    Edit Profile
                </p>

                <div className="flex flex-col gap-4">
                    {/* Username */}
                    <div>
                        <label className="text-[10px] font-bold tracking-widest uppercase
                              text-white mb-1.5 block">
                            Username
                        </label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.08]
                         rounded-xl px-4 py-2.5 text-sm text-slate-200
                         placeholder-slate-600 outline-none
                         focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10
                         transition-all duration-200"
                            placeholder="username"
                        />
                    </div>

                    {/* First / Last */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "First Name", val: firstName, set: setFirstName, ph: "First" },
                            { label: "Last Name",  val: lastName,  set: setLastName,  ph: "Last"  },
                        ].map(({ label, val, set, ph }) => (
                            <div key={label}>
                                <label className="text-[10px] font-bold tracking-widest uppercase
                                  text-white mb-1.5 block">
                                    {label}
                                </label>
                                <input
                                    value={val}
                                    onChange={(e) => set(e.target.value)}
                                    placeholder={ph}
                                    className="w-full bg-white/[0.04] border border-white/[0.08]
                             rounded-xl px-4 py-2.5 text-sm text-slate-200
                             placeholder-slate-600 outline-none
                             focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10
                             transition-all duration-200"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-[10px] font-bold tracking-widest uppercase
                              text-white mb-1.5 block">
                            Phone Number
                        </label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.08]
                         rounded-xl px-4 py-2.5 text-sm text-slate-200
                         placeholder-slate-600 outline-none
                         focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10
                         transition-all duration-200"
                            placeholder="+1 234 567 890"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.05] my-5" />

                {/* Save */}
                <button
                    className="w-full py-3 rounded-xl text-sm font-bold tracking-wide
                     bg-gradient-to-r from-cyan-500 to-indigo-500 text-white
                     shadow-[0_4px_20px_rgba(6,182,212,0.3)]
                     hover:opacity-90 hover:translate-y-[-1px]
                     active:translate-y-0 active:opacity-100
                     transition-all duration-150"
                >
                    Save Changes
                </button>
            </CardGlassBlur2>

        </CardList>
    );
}

export default Profile;