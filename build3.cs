using System;
using System.IO;
using System.Text;

class Build2
{
    static string Root;
    static string GetTxt(string name) { return File.ReadAllText(Path.Combine(Root, name), Encoding.UTF8); }
    static string Norm(string s) { return s.Replace("\r\n", "\n").Replace("\r", "\n").Replace("\n", "\r\n"); }
    static string ReplaceExact(string text, string oldStr, string newText, string tag)
    {
        int i = text.IndexOf(oldStr, StringComparison.Ordinal);
        if (i < 0) throw new Exception("not found: " + tag);
        if (text.IndexOf(oldStr, i + oldStr.Length, StringComparison.Ordinal) >= 0) throw new Exception("not unique: " + tag);
        return text.Substring(0, i) + Norm(newText) + text.Substring(i + oldStr.Length);
    }
    static string Block(string text, string sm, string em, string newText, string tag)
    {
        int i = text.IndexOf(sm, StringComparison.Ordinal);
        if (i < 0) throw new Exception("start not found: " + tag);
        int j = text.IndexOf(em, i + sm.Length, StringComparison.Ordinal);
        if (j < 0) throw new Exception("end not found: " + tag);
        Console.WriteLine("  [" + tag + "] " + i + ".." + j);
        return text.Substring(0, i) + Norm(newText) + text.Substring(j);
    }
    static string BlockAfter(string text, int from, string sm, string em, string newText, string tag)
    {
        int i = text.IndexOf(sm, from, StringComparison.Ordinal);
        if (i < 0) throw new Exception("start not found: " + tag);
        int j = text.IndexOf(em, i + sm.Length, StringComparison.Ordinal);
        if (j < 0) throw new Exception("end not found: " + tag);
        Console.WriteLine("  [" + tag + "] " + i + ".." + j);
        return text.Substring(0, i) + Norm(newText) + text.Substring(j);
    }

    static void Main()
    {
        Root = Directory.GetCurrentDirectory();
        Encoding enc = new UTF8Encoding(false);
        string H = GetTxt(".history/index(1)_20261102225557.html");
        Console.WriteLine("base len=" + H.Length);

        // ---------- HTML 结构 ----------
        int p1 = H.IndexOf("id=\"statBar\"", StringComparison.Ordinal) - 4;
        int pE = H.IndexOf("<div id=\"pageWrap\">", StringComparison.Ordinal);
        H = H.Substring(0, p1) + Norm(GetTxt("_p1.html")) + H.Substring(pE);

        int iAct = H.IndexOf("id=\"page-actions\"", StringComparison.Ordinal);
        int s2 = H.IndexOf("<div class=\"page-scroll\">", iAct, StringComparison.Ordinal);
        int e2 = H.IndexOf("<!-- 放逐页 -->", s2, StringComparison.Ordinal);
        H = H.Substring(0, s2) + Norm(GetTxt("_p2.html")) + H.Substring(e2);

        int iEx = H.IndexOf("id=\"page-exile\"", StringComparison.Ordinal);
        int s3 = H.IndexOf("<div class=\"page-scroll\">", iEx, StringComparison.Ordinal);
        int g = H.IndexOf("id=\"exileGo\"", s3, StringComparison.Ordinal);
        int e3 = H.IndexOf("</div>", g, StringComparison.Ordinal) + "</div>".Length;
        H = H.Substring(0, s3) + Norm(GetTxt("_p3.html")) + H.Substring(e3);
        Console.WriteLine("html done len=" + H.Length);

        // ---------- 数据层：先替占位符，再处理旧 ENDING_DEFS ----------
        H = Block(H, "// 证据列表", "// 剧情对话 VN",
                  GetTxt("_data.js") + "\r\n" + "/*__ENDING_DEFS__*/" + "\r\n", "data");
        H = Block(H, "// 结局定义\r\nconst ENDING_DEFS = {", "// 已解锁结局（持久化到 localStorage）",
                  GetTxt("_endings_def.js") + "\r\n", "old defs");
        H = ReplaceExact(H, "/*__ENDING_DEFS__*/", GetTxt("_endings_def.js"), "placeholder");

        // ---------- 状态层 ----------
        H = Block(H, "function freshState(){", "let toastTimer=null;", GetTxt("_state.js") + "\r\n", "state");

        // ---------- 行动页 ----------
        H = Block(H, "/* ============================================================ 行动页 */",
                     "/* ============================================================ 放逐页 */", GetTxt("_actions.js") + "\r\n", "actions");

        // ---------- 放逐页 ----------
        H = Block(H, "/* ============================================================ 放逐页 */",
                     "/* ============================================================ 主页 */", GetTxt("_exile.js") + "\r\n", "exile");

        // ---------- 主页 ----------
        H = Block(H, "function renderHome(){", "function showApp(id){", GetTxt("_home.js") + "\r\n", "home");

        // ---------- 夜间流转 ----------
        H = Block(H, "function nextNight(){", "/* ============================================================ 最终指认 */",
                  GetTxt("_next.js") + "\r\n", "next");

        // ---------- 最终指认 ----------
        H = Block(H, "/* ============================================================ 最终指认 */",
                     "/* ============================================================ 结局展示 */", GetTxt("_accuse.js") + "\r\n", "accuse");

        // ---------- 结局展示 ----------
        H = Block(H, "function showEnding(def){", "/* ============================================================ 弹窗 */",
                  GetTxt("_ending.js") + "\r\n", "ending");

        // ---------- 群聊输入 ----------
        int ri = H.IndexOf("function renderChatInput(", StringComparison.Ordinal);
        if (ri < 0) throw new Exception("renderChatInput missing");
        H = BlockAfter(H, ri, "  if(chatMode==='confess'){", "  if(chatMode==='pm'){", GetTxt("_chatinput.js"), "chat");

        // ---------- 补回 spendAP（消耗行动点） ----------
        H = ReplaceExact(H, "// 消耗行动点\r\n" + GetTxt("_groupspeak.js"), "// 消耗行动点\r\n" + GetTxt("_spendap.js") + "\r\n" + GetTxt("_groupspeak.js"), "spendap");

        // ---------- 巡夜路线数据（保留原 VN 播放器） ----------
        int sp = H.IndexOf("function startPatrolRoute(", StringComparison.Ordinal);
        if (sp < 0) throw new Exception("startPatrolRoute missing");
        int rA = H.IndexOf("/* ============ 路线 A ============ */", sp, StringComparison.Ordinal);
        int vn = H.IndexOf("// 剧情对话 VN 播放器", rA, StringComparison.Ordinal);
        if (rA < 0 || vn < 0) throw new Exception("route markers missing");
        Console.WriteLine("  [routes] " + rA + ".." + vn);
        H = H.Substring(0, rA) + Norm(GetTxt("_routes.js")) + "\r\n" + H.Substring(vn);

        File.WriteAllText(Path.Combine(Root, "index(1).html"), H, enc);
        Console.WriteLine("WROTE index(1).html " + H.Length);
    }
}
